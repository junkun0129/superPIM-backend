import { generateRandomString } from "../utils";
import { resultMessage } from "../config";
import { prisma } from "../db";
import { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
export const getProductPriceList: RequestHandler = async (req, res) => {
  try {
    const { pr_cd } = req.params;

    if (pr_cd === undefined) {
      res.status(400).json({
        message: "商品CDは必須です。",
        result: resultMessage.failed,
      });
    }

    const list = await prisma.price.findMany({
      where: {
        pr_cd,
      },
      select: {
        pes_cd: true,
        sls_cd: true,

        sale: {
          select: {
            sls_name: true,
          },
        },
        pes_price: true,
        pes_created_at: true,
      },
    });

    res.status(201).json({
      data: list,
      result: resultMessage.success,
      message: "価格情報が正常に取得されました。",
    });
  } catch (err: any) {
    console.error("Error creating price:", err);
    res.status(500).json({
      message: err.message,
      result: resultMessage.failed,
    });
  }
};
export const createPrice: RequestHandler = async (req, res) => {
  try {
    const { pr_cd, sls_cd, pes_price } = req.body; // リクエストボディから商品CD, セールCD, 価格を取得

    if (!pr_cd || sls_cd === undefined || pes_price === undefined) {
      res.status(400).json({
        message: "商品CD, セールCD, 価格は必須です。",
        result: resultMessage.failed,
      });
    }

    if (!Number(pes_price)) {
      res.status(400).json({
        message: "価格は数字にしてください。",
        result: resultMessage.failed,
      });
    }
    let createObject: Prisma.priceCreateArgs = {
      data: {
        pes_cd: generateRandomString(36),
        pes_price: Number(pes_price),
        pr_cd: pr_cd,
        pes_created_at: new Date(), // 作成日時を現在時刻に設定
      },
    };

    if (sls_cd !== "") {
      createObject = {
        data: {
          ...createObject.data,
          sls_cd,
        },
      };
    }

    await prisma.price.create(createObject);

    res.status(201).json({
      result: resultMessage.success,
      message: "価格情報が正常に登録されました。",
    });
  } catch (err: any) {
    console.error("Error creating price:", err);
    res.status(500).json({
      message: err.message,
      result: resultMessage.failed,
    });
  }
};

export const updatePrice: RequestHandler = async (req, res) => {
  try {
    const { pes_cd } = req.params;
    const { pes_price } = req.body;

    // 必須フィールドのチェック
    if (!pes_price === undefined || !Number(pes_price)) {
      res.status(400).json({
        message: "価格は必須です。",
        result: resultMessage.failed,
      });
    }

    const updatedPrice = await prisma.price.update({
      where: {
        pes_cd: pes_cd,
      },
      data: {
        pes_price: Number(pes_price),
      },
    });

    res.status(200).json({
      data: updatedPrice,
      result: resultMessage.success,
      message: "価格情報が正常に更新されました。",
    });
  } catch (err: any) {
    console.error("Error updating price:", err);

    if (err.code === "P2025") {
      res.status(404).json({
        message: "指定された価格情報が見つかりません。",
        result: resultMessage.failed,
      });
    }
    res.status(500).json({
      message: err.message || "価格情報の更新中にエラーが発生しました。",
      result: resultMessage.failed,
    });
  }
};

export const deletePrice: RequestHandler = async (req, res) => {
  try {
    const { pes_cd } = req.params;

    await prisma.price.delete({
      where: {
        pes_cd: pes_cd,
      },
    });

    res.status(200).json({
      // 204 No Content でも良いが、今回は200で成功メッセージを返す
      result: resultMessage.success,
      message: "価格情報が正常に削除されました。",
    });
  } catch (err: any) {
    console.error("Error deleting price:", err);
    // レコードが見つからない場合のハンドリング
    if (err.code === "P2025") {
      // Prisma Client のレコードが見つからないエラーコード
      res.status(404).json({
        message: "指定された価格情報が見つかりません。",
        result: resultMessage.failed,
      });
    }
    res.status(500).json({
      message: err.message || "価格情報の削除中にエラーが発生しました。",
      result: resultMessage.failed,
    });
  }
};
