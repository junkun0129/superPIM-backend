import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { assetUploadMiddleware } from "../middleware/upload.middleware";
import {
  changeMainAssetBox,
  createAssetBox,
  deleteAsset,
  deleteAssetBox,
  getAssetBoxes,
  uploadProductAsset,
} from "../controllers/asset.controller";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.get("/getasb", authMiddleware, getAssetBoxes);
router.post("/changemain", authMiddleware, changeMainAssetBox);
router.post("/createasb", authMiddleware, createAssetBox);
router.post("/deleteasb", authMiddleware, deleteAssetBox);
router.post("/deleteast", authMiddleware, deleteAsset);
router.post(
  "/upload/:pr_cd/:type",
  authMiddleware,
  upload.single("file"),
  uploadProductAsset
);

export default router;
