import { resultMessage } from "../config";
import { prisma } from "../db";
import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { generateRandomString } from "../utils";
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

export const uploadAsset: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "画像ファイルが必要" });
      return;
    }

    res.status(200).json({
      result: resultMessage.success,
      message: "アップロード成功",
    });
  } catch (err) {
    res.status(500).json({
      message: err,
      result: resultMessage.failed,
    });
  }
};

export const changeMainAssetBox: RequestHandler = async (req, res) => {
  try {
    const { asb_cd } = req.body;
    fs.writeFileSync("assets/main.txt", asb_cd, "utf8");
    await prisma.assetbox.updateMany({
      where: {
        asb_is_main: true,
      },
      data: {
        asb_is_main: false,
      },
    });

    await prisma.assetbox.update({
      where: {
        asb_cd,
      },
      data: {
        asb_is_main: true,
      },
    });

    res.status(200).json({
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "メインアセットボックスの変更に失敗しました",
    });
  }
};

export const createAssetBox: RequestHandler = async (req, res) => {
  try {
    const { asb_name, asb_type } = req.body;
    const asb_cd = generateRandomString(36);
    await prisma.assetbox.create({
      data: {
        asb_cd,
        asb_is_main: false,
        asb_type,
        asb_name,
      },
    });
    res.status(200).json({
      result: resultMessage.success,
      message: "アセットボックスの作成に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "アセットボックスの作成に失敗しました",
    });
  }
};

export const deleteAssetBox: RequestHandler = async (req, res) => {
  try {
    const { asb_cd } = req.body;
    const target = await prisma.assetbox.findUnique({
      where: { asb_cd },
    });

    if (!target) throw new Error();

    if (target.asb_is_main) {
      res.status(400).json({
        result: resultMessage.failed,
        message: "メインに指定されているアセットボックスは削除できません",
      });
    }

    await prisma.assetbox.delete({
      where: { asb_cd },
    });

    res.status(200).json({
      result: resultMessage.success,
      message: "アセットボックスの削除に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "アセットボックスの削除に失敗しました",
    });
  }
};

export const deleteAsset: RequestHandler = async (req, res) => {
  try {
    const { asb_cd, pr_cd } = req.body;
    fs.unlink(`assets/${asb_cd}/${pr_cd}`, (err) => {
      throw new Error();
    });

    res.status(200).json({
      result: resultMessage.success,
      message: "アセットの削除に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "アセットの削除に失敗しました",
    });
  }
};
export const readAsset: RequestHandler = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const im = req.query.im;

    const baseDir = path.resolve(__dirname, "../assets");
    const targetDir = path.resolve(baseDir, folder);
    const targetFile = path.resolve(targetDir, filename);

    if (!targetFile.startsWith(baseDir)) {
      res.status(400).send("Invalid path");
      return;
    }

    if (im === "true") {
      const thumbnailPath = path.resolve(targetDir, "thumbs", filename);
      if (fs.existsSync(thumbnailPath)) {
        res.sendFile(thumbnailPath);
      } else {
        res.status(404).send("Thumbnail not found");
      }
      return;
    }

    if (fs.existsSync(targetFile)) {
      res.sendFile(targetFile);
    } else {
      res.status(404).send("File not found");
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};
