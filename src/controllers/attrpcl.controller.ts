import { Prisma, product } from "@prisma/client";
import { resultMessage } from "../config";
import { prisma } from "../db";
import { Request, RequestHandler, Response } from "express";
import { generateRandomString, normalizeBoolean } from "../utils";

export const getPclAttrEntries: RequestHandler = async (req, res) => {
  try {
    const { pcl } = req.query as { pcl: string };
    const attrs = await prisma.attrpcl.findMany({
      where: {
        pcl_cd: pcl,
      },
      select: {
        atp_is_common: true,
        attr: {
          select: {
            atr_name: true,
            atr_cd: true,
            atr_default_value: true,
            atr_is_with_unit: true,
            atr_unit: true,
            atr_max_length: true,
            atr_not_null: true,
            atr_select_list: true,
            atr_control_type: true,
          },
        },
      },
    });
    res.status(200).json({
      data: attrs,
      result: resultMessage.success,
      message: "属性の取得に成功しました。",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "属性の取得に失敗しました。",
    });
  }
};

export const getAttrsForPrFilter: RequestHandler = async (req, res) => {
  const { selectedPclCd, keyword } = req.query as {
    selectedPclCd?: string;
    keyword?: string;
  };

  let keywordWhere: Prisma.attrWhereInput = {};
  if (keyword) {
    keywordWhere = {
      atr_name: {
        contains: keyword,
      },
    };
  }

  let selectedPclCdWhere: Prisma.attrWhereInput = {};
  if (selectedPclCd) {
    selectedPclCdWhere = {
      attrpcl: {
        some: {
          pcl_cd: selectedPclCd,
        },
      },
    };
  }
  const whereCondition: Prisma.attrWhereInput = {
    AND: [keywordWhere, selectedPclCdWhere],
  };
  try {
    const attrs = await prisma.attr.findMany({
      where: whereCondition,
      select: {
        atr_cd: true,
        atr_name: true,
        atr_control_type: true,
        atr_max_length: true,
        atr_select_list: true,
      },
    });

    res.status(200).json({
      data: attrs,
      result: resultMessage.success,
      message: "属性の取得に成功しました。",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "属性の取得に失敗しました。",
    });
  }
};

export const getAttrsEntries: RequestHandler = async (req, res) => {
  try {
    const data = await prisma.attr.findMany({
      select: {
        atr_cd: true,
        atr_name: true,
      },
    });

    res.status(200).json({
      data,
      result: resultMessage.success,
      message: "属性の取得に成功しました。",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "属性の取得に失敗しました。",
    });
  }
};
export const getAttrList: RequestHandler = async (req, res) => {
  try {
    const { pg, ps, or, kw } = req.query as {
      pg: string;
      ps: string;
      or: string;
      kw: string;
    };
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    if (or !== "asc" && or !== "desc") {
      res.status(400).json({
        message: "orderByの値が不正です",
        result: "failed",
      });
      return;
    }
    const orderBy: Prisma.attrOrderByWithRelationInput = {
      atr_name: or,
    };
    const [total, attrList] = await Promise.all([
      prisma.attr.count({
        where: {
          atr_name: {
            contains: kw,
          },
        },
      }),
      prisma.attr.findMany({
        skip: offset,
        take: pageSize,
        where: {
          atr_name: {
            contains: kw,
          },
        },
        orderBy,
      }),
    ]);

    res.status(200).json({
      message: "属性一覧の取得に成功しました",
      result: resultMessage.success,
      data: attrList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const getPclEntries: RequestHandler = async (req, res) => {
  try {
    const pclList = await prisma.pcl.findMany({
      select: {
        pcl_cd: true,
        pcl_name: true,
      },
    });

    res.status(200).json({
      message: "属性セット一覧の取得に成功しました",
      result: resultMessage.success,
      data: pclList,
    });
  } catch (err) {
    res.status(500).json({
      message: resultMessage.failed,
      result: err,
    });
  }
};

export const getPclList: RequestHandler = async (req, res) => {
  try {
    const { pg, ps, or, kw } = req.query as {
      pg: string;
      ps: string;
      or: string;
      kw: string;
    };
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    if (or !== "asc" && or !== "desc") {
      res.status(400).json({
        message: "orderByの値が不正です",
        result: "failed",
      });
      return;
    }
    const orderBy: Prisma.pclOrderByWithRelationInput = {
      pcl_name: or,
    };

    const [total, pclList] = await Promise.all([
      prisma.pcl.count({
        where: {
          pcl_name: {
            contains: kw,
          },
        },
        orderBy,
      }),
      prisma.pcl.findMany({
        skip: offset,
        take: pageSize,
        where: {
          pcl_name: {
            contains: kw,
          },
        },
        orderBy,
        select: {
          pcl_cd: true,
          pcl_name: true,
          pcl_created_at: true,
          pcl_is_deleted: true,
          _count: {
            select: {
              attrpcl: true,
            },
          },
        },
      }),
    ]);

    res.status(200).json({
      message: "属性一覧の取得に成功しました",
      result: resultMessage.success,
      data: pclList,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const getPclAttrsList: RequestHandler = async (req, res) => {
  try {
    const { pg, ps, or, kw, pcl, wks } = req.params;
    const offset: number = (Number(pg) - 1) * Number(ps);
    const pageSize: number = Number(ps);
    if (or !== "asc" && or !== "desc") {
      res.status(400).json({
        message: "orderByの値が不正です",
        result: resultMessage.failed,
      });
      return;
    }
    const orderBy: Prisma.attrpclOrderByWithRelationInput = {
      atr_cd: or,
    };

    const attrPclList = await prisma.attrpcl.findMany({
      skip: offset,
      take: pageSize,
      where: {
        atr_cd: {
          contains: kw,
        },
        pcl_cd: pcl,
      },
      orderBy,
    });

    res.status(200).json({
      message: "属性一覧の取得に成功しました",
      result: resultMessage.success,
      data: attrPclList,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const getPclDetail: RequestHandler = async (req, res) => {
  try {
    const { pcl_cd } = req.params;
    const pcl = await prisma.pcl.findUnique({
      where: { pcl_cd },
      select: {
        pcl_cd: true,
        pcl_name: true,
        pcl_created_at: true,
        attrpcl: {
          select: {
            atp_cd: true,
            atp_order: true,
            atp_is_common: true,
            atp_is_show: true,
            atp_alter_name: true,
            attr: {
              select: {
                atr_name: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      data: pcl,
      message: "商品分類詳細の取得に成功しました。",
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: "商品分類詳細の取得に失敗しました。",
      result: resultMessage.failed,
    });
  }
};
type CreateAttrBody = {
  atr_name: string;
  attr_is_with_unit: string;
  atr_control_type: string;
  atr_not_null: string;
  atr_max_length: string;
  atr_select_list: string;
  atr_default_value: string;
  atr_unit: string;
}[];
export const createAttr: RequestHandler = async (req, res) => {
  try {
    const attrs: CreateAttrBody = req.body;
    const data: Prisma.attrCreateManyInput[] = attrs.map((attr) => {
      const {
        atr_name,
        attr_is_with_unit,
        atr_control_type,
        atr_not_null,
        atr_max_length,
        atr_select_list,
        atr_default_value,
        atr_unit,
      } = attr;

      const atr_cd = generateRandomString(36);

      return {
        atr_cd,
        atr_name,
        atr_is_delete: "1",
        atr_is_with_unit: attr_is_with_unit,
        atr_control_type,
        atr_not_null,
        atr_max_length: Number(atr_max_length),
        atr_select_list,
        atr_default_value,
        atr_unit,
        atr_created_at: new Date(),
      };
    });

    await prisma.attr.createMany({
      data: data,
    });

    res.status(201).json({
      message: "属性の作成に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const createPcl: RequestHandler = async (req, res) => {
  try {
    const { pcl_name } = req.body;
    const pcl_cd = generateRandomString(36);
    const newPcl = await prisma.pcl.create({
      data: {
        pcl_cd,
        pcl_name,
        pcl_created_at: new Date(),
        pcl_is_deleted: "0",
      },
    });

    res.status(201).json({
      message: "属性の作成に成功しました",
      result: resultMessage.success,
      data: { pcl_cd },
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

type AddAttrsToPclBody = {
  pcl_cd: string;
  atr_cd: string;
  atp_is_show: string;
  atp_alter_name: string;
  atp_is_common: string;
  atp_order: number;
}[];
export const addAttrsToPcl: RequestHandler = async (req, res) => {
  try {
    const body: AddAttrsToPclBody = req.body;

    const data: Prisma.attrpclCreateManyInput[] = body.map((attr) => {
      const {
        pcl_cd,
        atr_cd,
        atp_is_show,
        atp_alter_name,
        atp_is_common,
        atp_order,
      } = attr;
      const atp_cd = generateRandomString(36);
      return {
        atp_cd,
        atr_cd,
        pcl_cd,
        atp_order,
        atp_is_show,
        atp_alter_name,
        atp_is_common,
      };
    });
    await prisma.attrpcl.createMany({
      data,
    });

    res.status(201).json({
      message: "属性の作成に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const updateAttr: RequestHandler = async (req, res) => {
  try {
    const {
      atr_cd,
      atr_name,
      attr_is_with_unit,
      atr_control_type,
      atr_not_null,
      atr_max_length,
      atr_select_list,
      atr_default_value,
      atr_unit,
    } = req.body;

    const updatedAttr = await prisma.attr.update({
      where: { atr_cd },
      data: {
        atr_name,
        atr_is_with_unit: attr_is_with_unit,
        atr_control_type,
        atr_not_null,
        atr_max_length: Number(atr_max_length),
        atr_select_list,
        atr_default_value,
        atr_unit,
        atr_updated_at: new Date(),
      },
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
      data: updatedAttr,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

type UpdatePclBody = {
  pcl_cd: string;
  pcl_name: string;
  attrs: {
    atp_cd: string;
    atp_alter_name: string;
    atp_is_common: string;
    atp_is_show: string;
    atp_order: string;
  }[];
};
export const updatePcl: RequestHandler = async (req, res) => {
  try {
    const { pcl_cd, pcl_name, attrs }: UpdatePclBody = req.body;

    const atpPromises = attrs.map((item) =>
      prisma.attrpcl.update({
        where: { atp_cd: item.atp_cd },
        data: {
          atp_alter_name: item.atp_alter_name,
          atp_is_common: item.atp_is_common,
          atp_is_show: item.atp_is_show,
          atp_order: Number(item.atp_order),
        },
      })
    );

    const pclPromise = prisma.pcl.update({
      where: { pcl_cd },
      data: {
        pcl_name,
      },
    });

    await prisma.$transaction([pclPromise, ...atpPromises]);

    res.status(200).json({
      message: "商品分類の更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: "商品分類の更新に成功しました",
      result: resultMessage.failed,
    });
  }
};

export const deleteAttr: RequestHandler = async (req, res) => {
  try {
    const { atr_cd } = req.body;
    await prisma.attr.delete({
      where: { atr_cd },
    });

    res.status(200).json({
      message: "属性の削除に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const deletePcl: RequestHandler = async (req, res) => {
  try {
    const { pcl_cd } = req.body;

    const products = await prisma.pcl.findUnique({
      where: { pcl_cd },
      select: {
        product: true,
      },
    });
    if (!products || products.product.length < 1) {
      await prisma.pcl.delete({
        where: { pcl_cd },
      });
      res.status(200).json({
        message: "属性の削除に成功しました",
        result: resultMessage.success,
      });
    } else {
      res.status(400).json({
        message: "選択された商品分類の中に商品に紐づく商品分類があります。",
        result: resultMessage.failed,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
      result: resultMessage.failed,
    });
  }
};

export const deleteAttrPcl: RequestHandler = async (req, res) => {
  try {
    const { pcl_cd, atr_cd, atp_cd } = req.body;
    const products = await prisma.product.findMany({
      where: {
        pcl_cd,
      },
    });

    if (products.length > 0) {
      res.status(400).json({
        message: "商品分類に商品が紐づいています",
        result: resultMessage.failed,
      });
    } else {
      await prisma.attrpcl.delete({
        where: { atp_cd },
      });
      res.status(200).json({
        message: "属性の削除に成功しました",
        result: resultMessage.success,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const updateAttrPcl: RequestHandler = async (req, res) => {
  try {
    const {
      pcl_cd,
      pcl_name,
      attrs,
    }: {
      pcl_cd: string;
      pcl_name: string;
      attrs: {
        atp_cd: string;
        atp_alter_name: string;
        atp_is_show: string;
        atp_is_common: string;
        atp_order: number;
      }[];
    } = req.body;

    await prisma.pcl.update({
      where: { pcl_cd },
      data: {
        pcl_name,
        attrpcl: {
          update: attrs.map((item) => {
            return {
              where: {
                atp_cd: item.atp_cd,
              },
              data: {
                atp_alter_name: item.atp_alter_name,
                atp_is_show: item.atp_is_show,
                atp_is_common: item.atp_is_common,
                atp_order: item.atp_order,
              },
            };
          }),
        },
      },
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};
export const updateAttrPclOrder: RequestHandler = async (req, res) => {
  try {
    const { atp_cd, atp_order } = req.params;
    await prisma.attrpcl.update({
      where: { atp_cd },
      data: {
        atp_order: Number(atp_order),
      },
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

type UpdateAttrValueBody = {
  pr_cd: string;
  attrs: {
    atr_cd: string;
    value: string;
  }[];
};
export const updateAttrValue: RequestHandler = async (req, res) => {
  try {
    const body: UpdateAttrValueBody = req.body;

    body.attrs.forEach(async (attr) => {
      const { atr_cd, value } = attr;

      const atv_cd = await prisma.attrvalue.findFirst({
        where: {
          atr_cd,
          pr_cd: body.pr_cd,
        },
        select: {
          atv_cd: true,
        },
      });
      if (!atv_cd) {
        res.status(404).json({
          message: "属性値が見つかりません",
          result: resultMessage.failed,
        });
        return;
      }
      const attrpcl = await prisma.attrvalue.update({
        where: {
          atv_cd: atv_cd.atv_cd,
        },
        data: {
          atv_value: value,
        },
      });
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

type GetProductAttrListParam = {
  //pr_cd
  pn: string;
  //pcl_cd
  pc: string;
  //共通項目か固有項目か両方か
  cs: string;
};

const attrpclCommonType = {
  common: "1",
  unique: "0",
  both: "2",
};

export const getProductAttrList: RequestHandler = async (req, res) => {
  try {
    const { pn, pc, cs }: GetProductAttrListParam = req.params as {
      pn: string;
      pc: string;
      cs: string;
    };

    let isCommonWhere: Prisma.attrpclWhereInput = {};
    if (cs !== attrpclCommonType.both) {
      isCommonWhere = {
        atp_is_common: cs,
      };
    }

    const cdWhere: Prisma.attrpclWhereInput = { pcl_cd: pc };

    const where: Prisma.attrpclWhereInput = {
      AND: [isCommonWhere, cdWhere],
    };

    const pclattrList = await prisma.attrpcl.findMany({
      where,
      select: {
        pcl_cd: true,
        atp_order: true,
        atp_is_show: true,
        atp_alter_name: true,
        atp_is_common: true,
        attr: {
          select: {
            atr_cd: true,
            atr_not_null: true,
            atr_max_length: true,
            atr_unit: true,
            atr_is_with_unit: true,
            atr_control_type: true,
            atr_name: true,
            atr_select_list: true,
            atr_default_value: true,
          },
        },
      },
    });

    let returnObject: any = {};
    pclattrList.forEach((pclattr) => {
      returnObject[pclattr.pcl_cd] = pclattr;
    });

    const attrvalueList = await prisma.attrvalue.findMany({
      where: {
        pr_cd: pn,
        attr: {
          attrpcl: {
            some: {
              pcl_cd: pc,
            },
          },
        },
      },
    });

    attrvalueList.forEach((attrvalue) => {
      if (!(attrvalue.atr_cd in returnObject)) return;
      returnObject[attrvalue.atr_cd] = {
        ...returnObject[attrvalue.atr_cd],
        value: attrvalue.atv_value,
      };
    });

    res.status(200).json({
      data: returnObject,
      message: "属性の取得に成功しました。",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};
