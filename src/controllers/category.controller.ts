import { resultMessage } from "config";
import { prisma } from "db";
import { Request, Response } from "express";

export const getProductCategories = async (req: Request, res: Response) => {
  try {
    const { pr_cd } = req.params;

    const links = await prisma.prcategory.findMany({
      where: { pr_cd },
      include: { category: true },
    });

    return res.status(200).json({
      message: "商品のカテゴリ取得に成功しました",
      result: links,
    });
  } catch (error) {
    return res.status(500).json({
      message: "商品のカテゴリ取得に失敗しました",
      result: error,
    });
  }
};
export const saveProductCategory = async (req: Request, res: Response) => {
  try {
    const { pr_cd, ctg_cd } = req.body;

    // 古いリンク削除
    await prisma.prcategory.deleteMany({
      where: { pr_cd },
    });

    // 新しいリンク追加
    await prisma.prcategory.create({
      data: {
        prc_cd: crypto.randomUUID(),
        pr_cd,
        ctg_cd,
      },
    });

    return res.status(200).json({
      message: "商品のカテゴリリンク保存に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    return res.status(500).json({
      message: "商品のカテゴリリンク保存に失敗しました",
      result: error,
    });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parent_cd } = req.body;

    const siblings = await prisma.category.findMany({
      where: { parent_cd },
      orderBy: { ctg_order: "desc" },
    });

    const newOrder = (siblings[0]?.ctg_order ?? -1) + 1;

    const newCategory = await prisma.category.create({
      data: {
        ctg_cd: crypto.randomUUID(),
        ctg_name: name,
        ctg_desc: "",
        ctg_order: newOrder,
        parent_cd,
      },
    });

    return res.status(200).json({
      message: "カテゴリ作成に成功しました",
      result: newCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "カテゴリ作成に失敗しました",
      result: error,
    });
  }
};
export const updateCategoryOrder = async (req: Request, res: Response) => {
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

    return res.status(200).json({
      message: "カテゴリの並び順更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    return res.status(500).json({
      message: "カテゴリの並び順更新に失敗しました",
      result: error,
    });
  }
};
