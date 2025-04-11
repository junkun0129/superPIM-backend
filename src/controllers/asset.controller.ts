import { resultMessage } from "config";
import { prisma } from "../db";
import { RequestHandler } from "express";

export const getAssetBoxes: RequestHandler = async (req, res) => {
  try {
    const assetboxes = await prisma.assetbox.findMany();
    res.status(200).json({
      data: assetboxes,
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
      result: resultMessage.failed,
    });
  }
};

export const getAssets: RequestHandler = async (req, res) => {
  try {
    const { asb_cd, pr_cd } = req.params;
    const assets = await prisma.asset.findMany({
      where: {
        asb_cd,
        pr_cd,
      },
    });
    res.status(200).json({
      data: assets,
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
      result: resultMessage.failed,
    });
  }
};

export const getAssetBoxes: RequestHandler = async (req, res) => {
  try {
    const assetboxes = await prisma.assetbox.findMany();
    res.status(200).json({
      data: assetboxes,
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
      result: resultMessage.failed,
    });
  }
};
