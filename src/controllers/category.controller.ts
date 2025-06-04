import { generateRandomString } from "../utils";
import { resultMessage } from "../config";
import { prisma } from "../db";
import { Request, RequestHandler, Response } from "express";
export const getCategories: RequestHandler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    // まずidをキーにマップ作る
    const categoryMap = new Map<string, any>();
    categories.forEach((cat) => {
      categoryMap.set(cat.ctg_cd, { ...cat, children: [] });
    });

    // ルートノードを集める配列
    const tree: any[] = [];

    // 親子を組み立て
    categoryMap.forEach((cat) => {
      if (cat.parent_cd) {
        const parent = categoryMap.get(cat.parent_cd);
        if (parent) {
          parent.children.push(cat);
        }
      } else {
        tree.push(cat);
      }
    });

    res.status(200).json({
      result: resultMessage.success,
      data: tree,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      result: resultMessage.failed,
      message: "Internal Server Error",
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
        ctg_cd: generateRandomString(36),
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
async function collectAllCategoryIds(ctg_cd: string): Promise<string[]> {
  // 最初に与えられたカテゴリと、そのすべての子を集める
  const result: string[] = [ctg_cd];

  async function recurse(currentId: string) {
    const children = await prisma.category.findMany({
      where: { parent_cd: currentId },
      select: { ctg_cd: true },
    });

    for (const child of children) {
      result.push(child.ctg_cd);
      await recurse(child.ctg_cd); // 子のさらに子を探しにいく
    }
  }

  await recurse(ctg_cd);

  return result;
}
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { ctg_cd } = req.body;
    // 1. 全カテゴリIDを集める
    const allCategoryIds = await collectAllCategoryIds(ctg_cd);

    // 2. これらに紐づいているProductがないかチェック
    const linkedProductCount = await prisma.product.count({
      where: {
        categories: {
          some: {
            ctg_cd: { in: allCategoryIds },
          },
        },
      },
    });

    if (linkedProductCount > 0) {
      res.status(400).json({
        message: "カテゴリに商品が紐づくため、削除できませんでした。",
      });
    }

    // 3. なければカテゴリを一括削除
    await prisma.category.deleteMany({
      where: {
        ctg_cd: { in: allCategoryIds },
      },
    });

    res.status(200).json({
      message: "カテゴリの削除に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: "カテゴリの削除に失敗しました",
      result: error,
    });
  }
};
