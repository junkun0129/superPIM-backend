import { resultMessage } from "../config";
import { prisma } from "../db";
import { Request, RequestHandler, Response } from "express";
import { generateRandomString } from "../utils";

export const getHeaders: RequestHandler = async (req, res) => {
  try {
    const { wks } = req.query as { wks: string };

    const headerPromise = prisma.header.findMany({
      where: { wks_cd: !wks ? null : wks },
      orderBy: { hdr_order: "asc" },
    });

    const attrListPromise = prisma.attr.findMany({
      select: {
        atr_cd: true,
        atr_name: true,
      },
    });

    const [headers, attrList] = await Promise.all([
      headerPromise,
      attrListPromise,
    ]);

    let attrObject: {
      [key: string]: string;
    } = {};
    attrList.forEach((item) => {
      attrObject[item.atr_cd] = item.atr_name;
    });

    res.status(200).json({
      message: "ヘッダーの取得に成功しました",
      result: resultMessage.success,
      data: { headers, attrList: attrObject },
    });
  } catch (error) {
    res.status(500).json({
      message: "ヘッダーの取得に失敗しました",
      result: error,
    });
  }
};

type UpdateHeadersBody = {
  wks_cd: string;
  headers: {
    hdr_cd: string;
    hdr_order: number;
  }[];
};
export const addHeader: RequestHandler = async (req, res) => {
  try {
    const { wks_cd, atr_cd } = req.body;

    const headersCount = await prisma.header.count({
      where: { wks_cd: !!wks_cd ? wks_cd : null },
    });
    await prisma.header.create({
      data: {
        hdr_cd: generateRandomString(36),
        attr_cd: atr_cd,
        hdr_order: headersCount + 1,
        hdr_width: 200, // Default width, adjust as needed
      },
    });

    res.status(201).json({
      message: "ヘッダーの追加に成功しました",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "ヘッダーの更新に失敗しました",
      result: error,
    });
  }
};

export const deleteHeader: RequestHandler = async (req, res) => {
  try {
    const { hdr_cd } = req.params;
    const header = await prisma.header.findUnique({
      where: { hdr_cd },
    });

    if (!header) {
      res.status(404).json({
        message: "ヘッダーが見つかりません",
      });
      return;
    }

    await prisma.header.delete({
      where: { hdr_cd },
    });

    res.status(200).json({
      message: "ヘッダーの削除に成功しました",
    });
  } catch (error) {
    res.status(500).json({
      message: "ヘッダーの更新に失敗しました",
      result: error,
    });
  }
};

export const updateHeaderOrder: RequestHandler = async (req, res) => {
  try {
    const { active_cd, over_cd, wks_cd: wksProps } = req.body;
    const wks_cd = !!wksProps ? wksProps : null;
    if (!active_cd || !over_cd) {
      res.status(400).json({
        message: "active_cd と over_cd の両方が必要です",
      });
      return;
    }

    const [activeHeader, overHeader] = await Promise.all([
      prisma.header.findUnique({ where: { hdr_cd: active_cd, wks_cd } }),
      prisma.header.findUnique({ where: { hdr_cd: over_cd, wks_cd } }),
    ]);

    if (!activeHeader) {
      res
        .status(404)
        .json({ message: "active_cd に対応するヘッダーが存在しません" });
      return;
    }

    if (!overHeader) {
      res.status(404).json({
        message: "over_cd に対応するヘッダーが削除されている可能性があります",
      });
      return;
    }

    if (activeHeader.hdr_order === overHeader.hdr_order) {
      res.status(200).json({ message: "すでに順番は正しく設定されています" });
      return;
    }

    const isMovingUp = activeHeader.hdr_order > overHeader.hdr_order;
    const newOrder = overHeader.hdr_order;

    let affectedHeaders = [];

    if (isMovingUp) {
      // 上に移動：newOrder ～ activeOrder - 1 を +1
      affectedHeaders = await prisma.header.findMany({
        where: {
          hdr_cd: { not: activeHeader.hdr_cd },
          hdr_order: {
            gte: newOrder,
            lt: activeHeader.hdr_order,
          },
        },
      });

      await prisma.$transaction([
        ...affectedHeaders.map((header) =>
          prisma.header.update({
            where: { hdr_cd: header.hdr_cd },
            data: { hdr_order: header.hdr_order + 1 },
          })
        ),
        prisma.header.update({
          where: { hdr_cd: activeHeader.hdr_cd },
          data: { hdr_order: newOrder },
        }),
      ]);
    } else {
      // 下に移動：activeOrder + 1 ～ newOrder を -1
      affectedHeaders = await prisma.header.findMany({
        where: {
          hdr_cd: { not: activeHeader.hdr_cd },
          hdr_order: {
            gt: activeHeader.hdr_order,
            lte: newOrder,
          },
        },
      });

      await prisma.$transaction([
        ...affectedHeaders.map((header) =>
          prisma.header.update({
            where: { hdr_cd: header.hdr_cd },
            data: { hdr_order: header.hdr_order - 1 },
          })
        ),
        prisma.header.update({
          where: { hdr_cd: activeHeader.hdr_cd },
          data: { hdr_order: newOrder },
        }),
      ]);
    }

    res.status(200).json({
      message: "ヘッダーの順番を更新しました",
    });
  } catch (error) {
    console.error("順番更新エラー:", error);
    res.status(500).json({
      message: "ヘッダーの順番の更新に失敗しました",
      result: error,
    });
  }
};

export const updateHeaderWidth: RequestHandler = async (req, res) => {
  try {
    const { hdr_cd, hdr_width, wks_cd } = req.body;
    await prisma.header.update({
      where: {
        hdr_cd,
        wks_cd: !!wks_cd ? wks_cd : null,
      },
      data: {
        hdr_width,
      },
    });

    res.status(200).json({
      message: "ヘッダーの幅変更に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    res.status(500).json({
      message: "ヘッダーの順番変更に失敗しました",
      result: resultMessage.failed,
    });
  }
};
