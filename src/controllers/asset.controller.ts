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

export const uploadProductAsset: RequestHandler = async (req, res) => {
  try {
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

    //保存先フォルダの処理
    let targetAsb: string = asb;

    if (im === "1") {
      const txtFilePath = path.join(
        __dirname,
        "..",
        "..",
        "assets",
        "main.txt"
      );
      const main_asb = fs.readFileSync(txtFilePath, "utf-8");

      targetAsb = main_asb;
    }

    const saveFolderPath = path.join(
      __dirname,
      "..",
      "..",
      "assets",
      targetAsb
    );
    await fs.promises.mkdir(saveFolderPath, { recursive: true });

    //保存するファイルの処理
    const ext = path.extname(file.originalname);
    const saveFilePath = path.join(
      __dirname,
      "..",
      "..",
      "assets",
      targetAsb,
      `${pr_cd}${ext}`
    );
    await fs.promises.writeFile(saveFilePath, file.buffer);

    const count = await prisma.asset.count({
      where: {
        pr_cd,
        asb_key: targetAsb,
      },
    });
    if (count > 0) {
      await prisma.asset.update({
        where: {
          pr_cd_asb_key: {
            pr_cd,
            asb_key: targetAsb,
          },
        },
        data: {
          ast_ext: ext,
          ast_img: `${targetAsb}/${pr_cd}${ext}`,
        },
      });
    } else {
      await prisma.asset.create({
        data: {
          ast_cd: generateRandomString(36),
          asb_key: targetAsb,
          ast_type: type,
          ast_ext: ext,
          ast_img: `${targetAsb}/${pr_cd}${ext}`,
          pr_cd,
        },
      });
    }
    res.status(200).json({
      result: resultMessage.success,
      message: "アセットのアップロードに成功しました",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "アセットのアップロードに失敗しました",
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
    const { asb_name, asb_type, asb_key } = req.body;
    const asb_cd = generateRandomString(36);
    await prisma.assetbox.create({
      data: {
        asb_cd,
        asb_key,
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

export const getMainAsb: RequestHandler = async(req, res)=>{
  try{
    const txtFilePath = path.join(
      __dirname,
      "..",
      "..",
      "assets",
      "main.txt"
    );
    const main_asb = fs.readFileSync(txtFilePath, "utf-8");

    res.status(200).json({
      result:resultMessage.success,
      message:'メイン画像のid取得に成功しました',
      data:main_asb
    })
  }catch(err){
    res.status(500).json({
      result: resultMessage.failed,
      message: "メイン画像のidの取得に成功しました",
    });
  }
}
