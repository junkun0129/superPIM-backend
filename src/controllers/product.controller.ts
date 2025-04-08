import { prisma } from "db";
import { Request, Response } from "express";
import { generateRandomString, getUserCd, normalizeBoolean } from "utils";
import { product, Prisma } from "@prisma/client";
import { resultMessage } from "config";

export const getProductsList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { is, pg, ps, ws, ob, or, kw } = req.params;
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    const orderBy = {
      [ob]: or,
    };

    const isSeries = normalizeBoolean(is);
    if (!isSeries)
      return res.status(400).json({
        message: "isの値が不正です",
        result: resultMessage.failed,
      });

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

    return res.status(200).json({
      result: resultMessage.success,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const getFilterdProductsList = async (req: Request, res: Response) => {
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
    if (!isSeries)
      return res.status(400).json({
        message: "isの値が不正です",
        result: resultMessage.failed,
      });

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
      });

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
      });

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

    return res.status(200).json({
      result: resultMessage.success,
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

    return res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cd }: { cd: string } = req.body;
    const product = await prisma.product.delete({
      where: {
        pr_cd: cd,
      },
    });

    return res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const updateProductStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cd, status }: { cd: string; status: string } = req.body;
    const pr_status = Number(status);
    if (isNaN(pr_status) || pr_status < 0 || pr_status > 2) {
      return res.status(400).json({
        message: "statusの値が不正です",
        result: resultMessage.failed,
      });
    }
    const product = await prisma.product.update({
      where: {
        pr_cd: cd,
      },
      data: {
        pr_acpt_status: pr_status,
      },
    });

    return res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
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

    return res.status(201).json({
      result: resultMessage.success,
      data: newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const checkProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
      return res.status(409).json({
        message: "同じCDがすでに使われています",
        result: resultMessage.failed,
      });
    }
    const doubledName = await prisma.product.findMany({
      where: {
        wks_cd,
        pr_name,
      },
    });

    if (doubledName.length > 0) {
      return res.status(409).json({
        message: "同じ名前がすでに使われています",
        result: resultMessage.failed,
      });
    }
    return res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    throw new Error("データベースとの接続に失敗しました");
  }
};
