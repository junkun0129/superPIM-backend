import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { assetUploadMiddleware } from "../middleware/upload.middleware";
import {
  changeMainAssetBox,
  createAssetBox,
  deleteAsset,
  deleteAssetBox,
  getAssetBoxes,
  getAssets,
  readAsset,
  uploadAsset,
} from "../controllers/asset.controller";
const router = express.Router();

router.get("/getast", authMiddleware, getAssets);
router.get("/getasb", authMiddleware, getAssetBoxes);
router.post("/changemain", authMiddleware, changeMainAssetBox);
router.post("/createasb", authMiddleware, createAssetBox);
router.post("/deleteasb", authMiddleware, deleteAssetBox);
router.post("/deleteast", authMiddleware, deleteAsset);
router.post("/read/:filename/:folder", authMiddleware, readAsset);
router.post(
  "/upload",
  authMiddleware,
  assetUploadMiddleware.single("image"),
  uploadAsset
);

export default router;
