import { Prisma, product } from "@prisma/client";
import { resultMessage } from "config";
import { prisma } from "db";
import { Request, RequestHandler, Response } from "express";
import { generateRandomString, normalizeBoolean } from "utils";

export const getAttrList: RequestHandler = async (req, res) => {
  try {
    const { pg, ps, or, kw } = req.params;
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
    const attrList = await prisma.attr.findMany({
      skip: offset,
      take: pageSize,
      where: {
        atr_name: {
          contains: kw,
        },
      },
      orderBy,
    });

    res.status(200).json({
      message: "属性一覧の取得に成功しました",
      result: resultMessage.success,
      data: attrList,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const getPclList: RequestHandler = async (req, res) => {
  try {
    const { pg, ps, or, kw } = req.params;
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
    const pclList = await prisma.pcl.findMany({
      skip: offset,
      take: pageSize,
      where: {
        pcl_name: {
          contains: kw,
        },
      },
      orderBy,
    });

    res.status(200).json({
      message: "属性一覧の取得に成功しました",
      result: resultMessage.success,
      data: pclList,
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
    const { pg, ps, or, kw, pcl, wks_cd } = req.params;
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
        wks_cd: wks_cd,
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
      const atr_is_with_unit_bool = normalizeBoolean(attr_is_with_unit);
      const atr_not_null_bool = normalizeBoolean(atr_not_null);
      return {
        atr_cd,
        atr_name,
        atr_is_delete: false,
        atr_is_with_unit: atr_is_with_unit_bool,
        atr_control_type,
        atr_not_null: atr_not_null_bool,
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
      },
    });

    res.status(201).json({
      message: "属性の作成に成功しました",
      result: resultMessage.success,
      data: newPcl,
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
  atp_alter_value: string;
  atp_is_common: string;
}[];
export const addAttrsToPcl: RequestHandler = async (req, res) => {
  try {
    const body: AddAttrsToPclBody = req.body;

    const attrpcl_count = await prisma.attrpcl.count();
    const data: Prisma.attrpclCreateManyInput[] = body.map((attr) => {
      const {
        pcl_cd,
        atr_cd,
        atp_is_show,
        atp_alter_name,
        atp_alter_value,
        atp_is_common,
      } = attr;
      const atp_cd = generateRandomString(36);
      return {
        atp_cd,
        atr_cd,
        pcl_cd,
        wks_cd: "0",
        atp_order: attrpcl_count + 1,
        atp_is_show: normalizeBoolean(atp_is_show),
        atp_alter_name,
        atp_alter_value,
        atp_is_common: normalizeBoolean(atp_is_common),
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
    const { atr_cd } = req.params;
    const {
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
        atr_is_with_unit: normalizeBoolean(attr_is_with_unit),
        atr_control_type,
        atr_not_null: normalizeBoolean(atr_not_null),
        atr_max_length: Number(atr_max_length),
        atr_select_list,
        atr_default_value,
        atr_unit,
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

export const updatePcl: RequestHandler = async (req, res) => {
  try {
    const { pcl_cd } = req.params;
    const { pcl_name } = req.body;

    const updatedPcl = await prisma.pcl.update({
      where: { pcl_cd },
      data: {
        pcl_name,
      },
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
      data: updatedPcl,
    });
  } catch (error) {
    res.status(500).json({
      message: resultMessage.failed,
      result: error,
    });
  }
};

export const deleteAttr: RequestHandler = async (req, res) => {
  try {
    const { atr_cd } = req.params;
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
    const { pcl_cd } = req.params;
    await prisma.pcl.delete({
      where: { pcl_cd },
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

export const deleteAttrPcl: RequestHandler = async (req, res) => {
  try {
    const { atp_cd } = req.params;
    await prisma.attrpcl.delete({
      where: { atp_cd },
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

export const updateAttrPcl: RequestHandler = async (req, res) => {
  try {
    const { atp_cd } = req.params;
    const {
      atp_is_show,
      atp_alter_name,
      atp_alter_value,
      atp_is_common,
    }: {
      atp_is_show: string;
      atp_alter_name: string;
      atp_alter_value: string;
      atp_is_common: string;
    } = req.body;

    const updatedAttrPcl = await prisma.attrpcl.update({
      where: { atp_cd },
      data: {
        atp_is_show: normalizeBoolean(atp_is_show),
        atp_alter_name,
        atp_alter_value,
        atp_is_common: normalizeBoolean(atp_is_common),
      },
    });

    res.status(200).json({
      message: "属性の更新に成功しました",
      result: resultMessage.success,
      data: updatedAttrPcl,
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
