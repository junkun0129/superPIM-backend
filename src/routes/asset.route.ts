import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { assetUploadMiddleware } from "../middleware/upload.middleware";
import {
  changeMainAssetBox,
  createAssetBox,
  deleteAsset,
  deleteAssetBox,
  downloadAsset,
  getAssetBoxes,
  getMainAssetBoxKey,
  getProductAssets,
  uploadProductAsset,
} from "../controllers/asset.controller";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get("/getasb", authMiddleware, getAssetBoxes);
router.get("/prlist", authMiddleware, getProductAssets);
router.post("/changemain", authMiddleware, changeMainAssetBox);
router.post("/createasb", authMiddleware, createAssetBox);
router.post("/deleteasb", authMiddleware, deleteAssetBox);
router.post("/deleteast", authMiddleware, deleteAsset);
router.get("/download", downloadAsset);
router.get("/mainkey", authMiddleware, getMainAssetBoxKey);
router.post(
  "/upload/:pr_cd/:type",
  authMiddleware,
  upload.single("file"),
  uploadProductAsset
);

export default router;
