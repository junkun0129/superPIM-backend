import { resultMessage } from "../config";
import { prisma } from "../db";
import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import { generateRandomString } from "../utils";
import { asset } from "@prisma/client";
import { rm, unlink } from "fs/promises";
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

export const getProductAssets: RequestHandler = async (req, res) => {
  try {
    const { pr_cd, type } = req.query as { pr_cd: string; type: string };
    const assetboxesPromise = prisma.assetbox.findMany({
      where: {
        asb_type: type,
      },
    });
    const assetsPromise = prisma.asset.findMany({
      where: {
        pr_cd,
        ast_type: type,
      },
    });

    const [assetboxes, assets] = await Promise.all([
      assetboxesPromise,
      assetsPromise,
    ]);

    let assetsObject: {
      [key: string]: asset;
    } = {};

    assets.forEach((asset) => {
      assetsObject[asset.asb_cd] = asset;
    });
    const main_asb = fs.readFileSync("assets/main.txt", "utf-8");
    res.status(200).json({
      data: {
        assets: assetsObject,
        assetboxes,
        main_cd: main_asb,
      },
      result: resultMessage.success,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
      result: resultMessage.failed,
    });
  }
};

export const uploadProductAsset: RequestHandler = async (req, res) => {
  const { pr_cd, type } = req.params;
  const { im, asb } = req.query as { im: string; asb: string };

  const file = req.file;
  if (!pr_cd || !file) {
    res.status(400).json({ error: "pr_cd または file がありません" });
    return;
  }

  if (!im && !asb) {
    res.status(400).json({ error: "必要な情報が含まれていません" });
    return;
  }

  const ext = path.extname(file.originalname);
  let targetAsb: string = asb;

  try {
    if (im === "1") {
      const main_asb = fs.readFileSync("assets/main.txt", "utf-8");
      targetAsb = main_asb;
    }
    //保存先のフォルダの作成
    await fs.promises.mkdir(`assets/${targetAsb}`, { recursive: true });

    //保存するファイルの処理
    await fs.promises.writeFile(
      `assets/${targetAsb}/${pr_cd}${ext}`,
      file.buffer
    );

    const count = await prisma.asset.count({
      where: {
        pr_cd,
        asb_cd: targetAsb,
      },
    });

    const createPromise = prisma.asset.create({
      data: {
        ast_cd: generateRandomString(36),
        asb_cd: targetAsb,
        ast_type: type,
        ast_ext: ext,
        pr_cd,
      },
    });

    let promises = [createPromise];

    if (count > 0) {
      const deletePromise = prisma.asset.delete({
        where: {
          pr_cd_asb_cd: {
            pr_cd,
            asb_cd: targetAsb,
          },
        },
      });
      promises.unshift(deletePromise);
    }

    await prisma.$transaction(promises);

    res.status(200).json({
      result: resultMessage.success,
      message: "アセットのアップロードに成功しました",
    });
  } catch (err) {
    await unlink(`assets/${targetAsb}/${pr_cd}${ext}`);
    console.log(err);
    res.status(500).json({
      message: "アセットのアップロードに失敗しました",
      result: resultMessage.failed,
    });
  }
};
export const getMainAssetBoxKey: RequestHandler = async (req, res) => {
  try {
    const mainKey = fs.readFileSync("assets/main.txt", "utf8");

    res.status(200).json({
      result: resultMessage.success,
      data: mainKey,
      message: "メインアセットボックス名の取得に成功しました",
    });
  } catch (err) {
    res.status(500).json({
      result: resultMessage.failed,
      message: "メインアセットボックス名の取得に失敗しました",
    });
  }
};
export const changeMainAssetBox: RequestHandler = async (req, res) => {
  try {
    const { asb_cd } = req.body;
    fs.writeFileSync("assets/main.txt", asb_cd, "utf8");

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

    const deleteAssets = prisma.asset.deleteMany({
      where: {
        asb_cd,
      },
    });

    const deleteAssetBox = prisma.assetbox.delete({
      where: { asb_cd },
    });

    await prisma.$transaction([deleteAssets, deleteAssetBox]);

    await rm(`assets/${asb_cd}`, { recursive: true, force: true });

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
    const { asb_cd, pr_cd, ext } = req.body;
    console.log(asb_cd);
    console.log(pr_cd);
    await prisma.asset.delete({
      where: {
        pr_cd_asb_cd: {
          pr_cd,
          asb_cd,
        },
      },
    });
    await unlink(`assets/${asb_cd}/${pr_cd}${ext}`);

    res.status(200).json({
      result: resultMessage.success,
      message: "アセットの削除に成功しました",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: resultMessage.failed,
      message: "アセットの削除に失敗しました",
    });
  }
};

export const downloadAsset: RequestHandler = async (req, res) => {
  try {
    const { asb_cd, pr_cd, ext } = req.query as {
      asb_cd: string;
      pr_cd: string;
      ext: string;
    };
    const folderPath = `assets/${asb_cd}/${pr_cd}${ext}`;
    const fileName = `${pr_cd}${ext}`;

    res.download(folderPath, fileName, (err) => {
      if (err) throw new Error();
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: resultMessage.failed,
      message: "メインアセットボックス名の取得に失敗しました",
    });
  }
};
