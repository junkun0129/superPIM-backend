import { prisma } from "../db";
import { RequestHandler } from "express";
import { generateRandomString, normalizeBoolean } from "../utils";
import { Prisma } from "@prisma/client";
import { resultMessage } from "../config";

export const getProductsList: RequestHandler = async (req, res) => {
  try {
    const { is, pg, ps, ws, ob, or, kw } = req.params;
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    const orderBy = {
      [ob]: or,
    };

    const isSeries = normalizeBoolean(is);
    if (!isSeries) {
      res.status(400).json({
        message: "isの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }

    const baseWhere: Prisma.productWhereInput = {
      pr_is_series: isSeries,
      wks_cd: ws,
    };
    let kwWhere: Prisma.productWhereInput = {};

    if (kw) {
      kwWhere = {
        OR: [
          {
            pr_name: {
              contains: kw,
            },
          },
          {
            pr_cd: {
              contains: kw,
            },
          },
        ],
      };
    }
    const where: Prisma.productWhereInput = {
      AND: [baseWhere, kwWhere],
    };

    const products = await prisma.product.findMany({
      skip: offset,
      take: pageSize,
      where,
      orderBy,
    });

    res.status(200).json({
      result: resultMessage.success,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const getFilterdProductsList: RequestHandler = async (req, res) => {
  try {
    const { is, pg, ps, ws, ob, or, kw } = req.params;
    const {
      cons,
    }: {
      cons: { atr: string; kw: string; con: string; op: string }[];
    } = req.body;

    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    const orderBy = {
      [ob]: or,
    };

    const isSeries = normalizeBoolean(is);
    if (!isSeries) {
      res.status(400).json({
        message: "isの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }

    const baseWhere: Prisma.productWhereInput = {
      pr_is_series: isSeries,
      wks_cd: ws,
    };

    const consWhere: Prisma.productWhereInput = {};

    consWhere.AND = cons
      .filter((con) => con.con === "and")
      .map((con) => {
        return {
          attrValues: {
            some: {
              atr_cd: con.atr,
              atv_value: {
                contains: con.kw,
              },
            },
          },
        };
      }) as any;

    consWhere.OR = cons
      .filter((con) => con.con === "or")
      .map((con) => {
        return {
          attrValues: {
            some: {
              atr_cd: con.atr,
              atv_value: {
                contains: con.kw,
              },
            },
          },
        };
      }) as any;

    let kwWhere: Prisma.productWhereInput = {};

    if (kw) {
      kwWhere = {
        OR: [
          {
            pr_name: {
              contains: kw,
            },
          },
          {
            pr_cd: {
              contains: kw,
            },
          },
        ],
      };
    }
    const where: Prisma.productWhereInput = {
      AND: [baseWhere, kwWhere, consWhere],
    };

    const products = await prisma.product.findMany({
      skip: offset,
      take: pageSize,
      where,
      orderBy,
    });

    res.status(200).json({
      result: resultMessage.success,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const {
      cd,
      name,
      desc,
      pcl,
      category,
    }: {
      cd: string;
      name: string;
      desc: string;
      pcl: string;
      category: string;
    } = req.body;

    const product = await prisma.product.update({
      where: {
        pr_cd: cd,
      },
      data: {
        pr_name: name,
        prcategory: {
          updateMany: {
            where: {
              pr_cd: cd,
            },
            data: {
              ctg_cd: category, // updating the category code
            },
          },
        },
        pr_description: desc,
        pcl_cd: pcl,
      },
    });

    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { cd }: { cd: string } = req.body;
    await prisma.product.delete({
      where: {
        pr_cd: cd,
      },
    });

    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const updateProductStatus: RequestHandler = async (req, res) => {
  try {
    const { cd, status }: { cd: string; status: string } = req.body;
    const pr_status = Number(status);
    if (isNaN(pr_status) || pr_status < 0 || pr_status > 2) {
      res.status(400).json({
        message: "statusの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }
    const product = await prisma.product.update({
      where: {
        pr_cd: cd,
      },
      data: {
        pr_acpt_status: pr_status,
      },
    });

    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const {
      pr_name,
      pcl_cd,
      pr_cd,
      wks_cd,
      ctg_cd,
      attrvalues,
    }: {
      pr_name: string;
      pcl_cd: string;
      ctg_cd: string;
      pr_cd: string;
      wks_cd: string;
      attrvalues: { atr_cd: string; atv_value: string }[];
    } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        pr_name,
        pr_description: "",
        pcl_cd,
        wks_cd: wks_cd,
        pr_is_series: true,
        pr_acpt_status: 0,
        pr_cd,
        pr_created_at: new Date(),
        attrvalue: {
          createMany: {
            data: attrvalues.map((attr) => ({
              atr_cd: attr.atr_cd,
              atv_value: attr.atv_value,
              atv_cd: generateRandomString(36),
              pr_cd: pr_cd,
            })),
          },
        },
        prcategory: {
          create: {
            ctg_cd,
            prc_cd: generateRandomString(36),
          },
        },
      },
    });

    res.status(201).json({
      result: resultMessage.success,
      data: newProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const checkProduct: RequestHandler = async (req, res) => {
  try {
    const {
      pr_cd,
      pr_name,
      wks_cd,
    }: { pr_cd: string; pr_name: string; wks_cd: string } = req.body;
    const doubleCd = await prisma.product.findMany({
      where: {
        wks_cd,
        pr_cd,
      },
    });

    if (doubleCd.length > 0) {
      res.status(409).json({
        message: "同じCDがすでに使われています",
        result: resultMessage.failed,
      });
      return;
    }
    const doubledName = await prisma.product.findMany({
      where: {
        wks_cd,
        pr_name,
      },
    });

    if (doubledName.length > 0) {
      res.status(409).json({
        message: "同じ名前がすでに使われています",
        result: resultMessage.failed,
      });
      return;
    }
    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    throw new Error("データベースとの接続に失敗しました");
  }
};
