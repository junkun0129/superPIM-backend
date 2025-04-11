import express from "express";
import {
  getAttrList,
  getPclList,
  getPclAttrsList,
  createAttr,
  createPcl,
  addAttrsToPcl,
  updateAttr,
  updatePcl,
  deleteAttr,
  deletePcl,
  deleteAttrPcl,
  updateAttrPcl,
} from "../controllers/attrpcl.controller"; // コントローラーのファイル名に合わせてパスを調整してください
import { authMiddleware } from "../middleware/auth.middleware"; // 必要に応じて

const router = express.Router();

// 属性関連
router.get("/attr/list", authMiddleware, getAttrList);
router.post("/attr/create", authMiddleware, createAttr);
router.put("/attr/update", authMiddleware, updateAttr);
router.delete("/attr/delete", authMiddleware, deleteAttr);

// pcl（属性カテゴリ）関連
router.get("/pcl/list", authMiddleware, getPclList);
router.post("/pcl/create", authMiddleware, createPcl);
router.put("/pcl/update", authMiddleware, updatePcl);
router.delete("/pcl/delete", authMiddleware, deletePcl);

// pcl-attr 関連（中間テーブル）
router.get("/pclattrs", authMiddleware, getPclAttrsList);
router.post("/pclattrs/add", authMiddleware, addAttrsToPcl);
router.put("/pclattrs/update", authMiddleware, updateAttrPcl);
router.delete("/pclattrs/delete", authMiddleware, deleteAttrPcl);

export default router;
