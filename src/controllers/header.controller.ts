import { resultMessage } from "config";
import { prisma } from "db";
import { Request, Response } from "express";

export const getHeaders = async (req: Request, res: Response) => {
  try {
    const { wks_cd } = req.params;
    const headers = await prisma.header.findMany({
      where: { wks_cd },
      orderBy: { hdr_order: "asc" },
    });

    return res.status(200).json({
      message: "ヘッダーの取得に成功しました",
      result: headers,
    });
  } catch (error) {
    return res.status(500).json({
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
export const updateHeaders = async (req: Request, res: Response) => {
  try {
    const { wks_cd, hdr_cd, hdr_order } = req.body;

    const wksedHeaders = await prisma.header.findMany({
      where: { wks_cd },
      orderBy: { hdr_order: "asc" },
    });

    await prisma.header.updateMany({
      where: { wks_cd },
      data: { hdr_order },
    });

    return res.status(200).json({
      message: "ヘッダーの更新に成功しました",
      result: resultMessage.success,
    });
  } catch (error) {
    return res.status(500).json({
      message: "ヘッダーの更新に失敗しました",
      result: error,
    });
  }
};
