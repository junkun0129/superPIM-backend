import { prisma } from "../db";
import { Request, RequestHandler, Response } from "express";
import { generateRandomString, normalizeBoolean } from "../utils";
import { Prisma } from "@prisma/client";
import { operands, resultMessage } from "../config";
import fs from "fs";
import path from "path";
type AttrFilter = {
  attr_cd: string;
  operand: (typeof operands)[keyof typeof operands];
  value: string;
};
const getProductList = async ({
  is,
  pg,
  ps,
  ws,
  ob,
  or,
  kw,
  ct,
  id,
  isFiltered = false,
  req,
  res,
  attrFilters = [],
}: {
  is: string;
  pg: number;
  ps: number;
  ws: string;
  ob: string;
  or: string;
  kw: string;
  ct: string;
  id: string;
  isFiltered?: boolean;
  req: Request;
  res: Response;
  attrFilters?: AttrFilter[];
}) => {
  try {
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    const orderBy = {
      [String(ob)]: String(or),
    };

    if (is !== "0" && is !== "1") {
      res.status(400).json({
        message: "isの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }

    if (id !== "0" && id !== "1") {
      res.status(400).json({
        message: "idの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }
    const mainAssetBoxKey = fs.readFileSync("assets/main.txt", "utf8");

    const baseWhere: Prisma.productWhereInput = {
      pr_is_series: is,
      pr_is_deleted: id,
    };

    let kwWhere: Prisma.productWhereInput = {};

    if (!!kw) {
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

    let wsWhere: Prisma.productWhereInput = {};
    if (!!ws) {
      wsWhere = {
        productworkspace: {
          some: {
            wks_cd: ws,
          },
        },
      };
    }

    let ctWhere: Prisma.productWhereInput = {};
    if (!!ct) {
      const categoryWithChildren = await prisma.category.findUnique({
        where: { ctg_cd: ct },
        include: {
          children: true, // 子カテゴリを含む
        },
      });
      let allCategoryIds = [ct];
      if (categoryWithChildren) {
        allCategoryIds = [
          ct,
          ...categoryWithChildren.children.map((c) => c.ctg_cd),
        ];
      }

      ctWhere = {
        categories: {
          some: {
            ctg_cd: {
              in: allCategoryIds,
            },
          },
        },
      };
    }
    let attrWhere = {} as Prisma.productWhereInput;

    if (isFiltered && attrFilters.length > 0) {
      attrWhere = {
        attrvalue: {
          some: {
            AND: attrFilters.map((filter) => {
              const { attr_cd, operand, value } = filter;
              switch (operand) {
                case operands.greaterThan:
                  return {
                    atr_cd: attr_cd,
                    atv_value: {
                      gt: value,
                    },
                  };
                case operands.lessThan:
                  return {
                    atr_cd: attr_cd,
                    atv_value: {
                      lt: value,
                    },
                  };
                case operands.greaterThanOrEqual:
                  return {
                    atr_cd: attr_cd,
                    atv_value: {
                      gte: value,
                    },
                  };
                case operands.lessThanOrEqual:
                  return {
                    atr_cd: attr_cd,
                    atv_value: {
                      lte: value,
                    },
                  };
                case operands.equal:
                  return {
                    atr_cd: attr_cd,
                    atv_value: value,
                  };
                case operands.notEqual:
                  return {
                    atr_cd: attr_cd,
                    atv_value: {
                      not: value,
                    },
                  };
                case operands.contains:
                  return {
                    atr_cd: attr_cd,
                  };
                case operands.notContains:
                  return {
                    atr_cd: {
                      not: attr_cd,
                    },
                  };
                default:
                  return {};
              }
            }),
          },
        },
      };
    }

    const where: Prisma.productWhereInput = {
      AND: [baseWhere, kwWhere, wsWhere, ctWhere, attrWhere],
    };

    const productsPromise = prisma.product.findMany({
      skip: offset,
      take: pageSize,
      where,
      orderBy,
      select: {
        pr_cd: true,
        pr_hinban: true,
        pr_name: true,
        pr_is_discontinued: true,
        pr_acpt_status: true,
        pr_acpt_last_updated_at: true,
        pr_labels: true,
        pr_created_at: true,
        pr_updated_at: true,
        pcl: {
          select: {
            pcl_name: true,
          },
        },
        asset: {
          select: {
            ast_ext: true,
          },
        },
        attrvalue:
          is === "0"
            ? {
                select: {
                  atv_value: true,
                  atr_cd: true,
                },
              }
            : {},
      },
    });
    const totalPromise = prisma.product.count({
      where,
    });
    const [data, total] = await Promise.all([productsPromise, totalPromise]);

    res.status(200).json({
      result: resultMessage.success,
      data,
      mainAssetBoxKey,
      total,
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const getProductsList: RequestHandler = async (req, res) => {
  const { is, pg, ps, ws, ob, or, kw, ct, id } = req.query as unknown as {
    is: string;
    pg: number;
    ps: number;
    ws: string;
    ob: string;
    or: string;
    kw: string;
    ct: string;
    id: string;
  };
  await getProductList({ is, pg, ps, ws, ob, or, kw, ct, id, req, res });
};

export const getFilterdProductsList: RequestHandler = async (req, res) => {
  const { is, pg, ps, ws, ob, or, kw, ct, id } = req.query as unknown as {
    is: string;
    pg: number;
    ps: number;
    ws: string;
    ob: string;
    or: string;
    kw: string;
    ct: string;
    id: string;
  };

  const attrFilters: AttrFilter[] = req.body;
  await getProductList({
    is,
    pg,
    ps,
    ws,
    ob,
    or,
    kw,
    ct,
    id,
    req,
    res,
    isFiltered: true,
    attrFilters,
  });
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { cd }: { cd: string } = req.body;
    console.log(cd, "kokokokorerrererereer");
    await prisma.asset.deleteMany({
      where: {
        pr_cd: cd,
      },
    });
    await prisma.product.delete({
      where: {
        pr_cd: cd,
      },
    });

    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    console.log(err);
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
    await prisma.product.update({
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
      pcl_cd,
      pr_name,
      pr_hinban,
      ctg_cd,
      attrvalues,
      is_series,
    }: {
      is_series: string;
      pr_name: string;
      pr_hinban: string;
      ctg_cd: string;
      pcl_cd: string;
      attrvalues: { atr_cd: string; atv_value: string }[];
    } = req.body;
    const pr_cd = generateRandomString(36);
    console.log(pr_cd);
    const newProduct = await prisma.product.create({
      data: {
        pr_cd: pr_cd,
        pr_name,
        pr_hinban,
        pr_description: "",
        pcl_cd,
        pr_is_deleted: "0",
        pr_series_cd: "",
        pr_labels: "",
        pr_is_discontinued: "0",
        pr_is_series: is_series,
        pr_acpt_status: 0,
        pr_created_at: new Date(),
        categories: !!ctg_cd
          ? {
              connect: {
                ctg_cd,
              },
            }
          : {},
        attrvalue: {
          create: attrvalues.map((attr) => ({
            atr_cd: attr.atr_cd,
            atv_value: attr.atv_value,
            atv_cd: generateRandomString(36),
          })),
        },
      },
    });
    console.log(newProduct, "newproduct");
    res.status(201).json({
      result: resultMessage.success,
      data: newProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: err,
    });
  }
};

export const checkProduct: RequestHandler = async (req, res) => {
  try {
    const { pr_hinban, pr_name }: { pr_hinban: string; pr_name: string } =
      req.body;
    const doublehinban = await prisma.product.findMany({
      where: {
        pr_hinban,
      },
    });

    if (doublehinban.length > 0) {
      res.status(409).json({
        message: "同じ商品コードがすでに使われています",
        result: resultMessage.failed,
      });
      return;
    }

    const doubledName = await prisma.product.findMany({
      where: {
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
      message: "重複ナシ",
    });
  } catch (err) {
    throw new Error("データベースとの接続に失敗しました");
  }
};

export const getProductDetail: RequestHandler = async (req, res) => {
  try {
    const { pr_cd } = req.params;
    const filePath = path.join(__dirname, "..", "..", "assets", "main.txt");
    const content = fs.readFileSync(filePath, "utf-8");
    const main_asb = content.trim();

    const productData = await prisma.product.findUnique({
      where: { pr_cd },
      select: {
        pr_cd: true,
        pr_name: true,
        pr_hinban: true,
        pr_is_discontinued: true,
        pr_acpt_status: true,
        pr_labels: true,
        pr_created_at: true,
        pr_updated_at: true,
        pr_is_series: true,
        pr_description: true,
        pcl_cd: true,
        pcl: { select: { pcl_name: true } },
        categories: { select: { ctg_cd: true } },
      },
    });

    const attrvaluesData = await prisma.attrvalue.findMany({
      where: {
        pr_cd,
      },
      select: {
        atv_cd: true,
        atv_value: true,
        attr: {
          select: {
            atr_cd: true,
            atr_name: true,
            atr_is_with_unit: true,
            attrpcl: {
              where: {
                pcl_cd: productData?.pcl_cd,
              },
              select: {
                atp_is_common: true,
                atp_order: true,
              },
            },
            atr_unit: true,
            atr_control_type: true,
            atr_select_list: true,
            atr_max_length: true,
            atr_not_null: true,
          },
        },
      },
    });

    const asset = await prisma.asset.findUnique({
      where: {
        pr_cd: pr_cd,
        pr_cd_asb_cd: {
          pr_cd,
          asb_cd: main_asb,
        },
      },
    });

    const data = {
      product: productData,
      attrvalues: attrvaluesData,
      asset,
    };
    res.status(200).json({
      result: resultMessage.success,
      message: "商品詳細の取得に成功しました",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const updateProductNameAndDesc: RequestHandler = async (req, res) => {
  try {
    const {
      pr_cd,
      pr_name,
      pr_description,
    }: {
      pr_cd: string;
      pr_name: string;
      pr_description: string;
    } = req.body;

    await prisma.product.update({
      where: {
        pr_cd,
      },
      data: {
        pr_name,
        pr_description,
      },
    });
    res.status(200).json({
      result: resultMessage.success,
      message: "商品の名前と説明の更新に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};
export const updateProductPcl: RequestHandler = async (req, res) => {
  try {
    const {
      pr_cd,
      pcl_cd,
    }: {
      pr_cd: string;
      pcl_cd: string;
    } = req.body;

    await prisma.product.update({
      where: {
        pr_cd,
      },
      data: {
        pcl_cd,
      },
    });
    res.status(200).json({
      result: resultMessage.success,
      message: "商品の商品分類の更新に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};
export const updateProductCategory: RequestHandler = async (req, res) => {
  try {
    const {
      pr_cd,
      ctg_cd,
    }: {
      pr_cd: string;
      ctg_cd: string;
    } = req.body;

    await prisma.$transaction(async (tx) => {
      // ① 既存のカテゴリ関連を削除
      await tx.product.update({
        where: { pr_cd },
        data: {
          categories: {
            set: [], // ←これで中間テーブルを空にできる！
          },
        },
      });

      if (!!ctg_cd) {
        // ② 新しいカテゴリを紐付け
        await tx.product.update({
          where: { pr_cd },
          data: {
            categories: {
              connect: [{ ctg_cd }],
            },
          },
        });
      }
    });

    res.status(200).json({
      result: resultMessage.success,
      message: "商品のカテゴリの更新に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};
