import { resultMessage } from "../config";
import { prisma } from "../db";
import { Request, RequestHandler, Response } from "express";

export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true },
    });
    res.status(200).json({
      result: resultMessage.success,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({
      message: "",
      result: resultMessage.failed,
    });
  }
};

export const getProductCategories: RequestHandler = async (req, res) => {
  try {
    const { pr_cd } = req.params;

    const links = await prisma.category.findMany({
      where: {
        products: {
          some: { pr_cd },
        },
      },
    });

    res.status(200).json({
      message: "商品のカテゴリ取得に成功しました",
      result: links,
    });
  } catch (error) {
    res.status(500).json({
      message: "商品のカテゴリ取得に失敗しました",
      result: error,
    });
  }
};
export const saveProductCategory: RequestHandler = async (req, res) => {
  try {
    const { pr_cd, ctg_cd } = req.body;

    // // 古いリンク削除
    // await prisma.prcategory.deleteMany({
    //   where: { pr_cd },
    // });

    // // 新しいリンク追加
    // await prisma.prcategory.create({
    //   data: {
    //     prc_cd: crypto.randomUUID(),
    //     pr_cd,
    //     ctg_cd,
    //   },
    // });

    res.status(200).json({
      message: "商品のカテゴリリンク保存に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: "商品のカテゴリリンク保存に失敗しました",
      result: error,
    });
  }
};
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { ctg_name, parent_cd } = req.body;
    let newOrder: number;

    const siblings = await prisma.category.findMany({
      where: { parent_cd: parent_cd === "" ? null : parent_cd },
      orderBy: { ctg_order: "desc" },
    });

    newOrder = siblings.length ? siblings.length + 1 : 0;

    const i = await prisma.category.create({
      data: {
        ctg_cd: crypto.randomUUID(),
        ctg_name,
        ctg_desc: "",
        ctg_order: newOrder,
        parent_cd: parent_cd === "" ? null : parent_cd,
      },
    });
    console.log(i);
    res.status(200).json({
      message: "カテゴリ作成に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "カテゴリ作成に失敗しました",
      result: resultMessage.failed,
    });
  }
};
export const updateCategoryOrder: RequestHandler = async (req, res) => {
  try {
    const {
      sortedCategories,
    }: { sortedCategories: { ctg_cd: string; ctg_order: string }[] } = req.body; // [{ ctg_cd, ctg_order }, ...]

    const updates = sortedCategories.map(({ ctg_cd, ctg_order }) =>
      prisma.category.update({
        where: { ctg_cd },
        data: { ctg_order: parseInt(ctg_order) },
      })
    );

    await Promise.all(updates);

    res.status(200).json({
      message: "カテゴリの並び順更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: "カテゴリの並び順更新に失敗しました",
      result: error,
    });
  }
};
