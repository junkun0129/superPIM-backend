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
  getAttrsEntries,
  getPclDetail,
  getPclEntries,
  getPclAttrEntries,
  getAttrsForPrFilter,
  getProductAttrList,
  updateProductAttrs,
} from "../controllers/attrpcl.controller"; // コントローラーのファイル名に合わせてパスを調整してください
import { authMiddleware } from "../middleware/auth.middleware"; // 必要に応じて

const router = express.Router();

// 属性関連
router.get("/attr/list", authMiddleware, getAttrList);
router.post("/attr/create", authMiddleware, createAttr);
router.post("/attr/update", authMiddleware, updateAttr);
router.post("/attr/delete", authMiddleware, deleteAttr);
router.get("/attr/entries", authMiddleware, getAttrsEntries);
router.get("/attr/filterlist", authMiddleware, getAttrsForPrFilter);

// pcl（属性カテゴリ）関連
router.get("/pcl/list", authMiddleware, getPclList);
router.get("/pcl/detail/:pcl_cd", authMiddleware, getPclDetail);
router.post("/pcl/create", authMiddleware, createPcl);
router.post("/pcl/update", authMiddleware, updatePcl);
router.post("/pcl/delete", authMiddleware, deletePcl);
router.get("/pcl/entries", authMiddleware, getPclEntries);

// pcl-attr 関連（中間テーブル）
router.get("/pclattrs/list", authMiddleware, getPclAttrsList);
router.post("/pclattrs/add", authMiddleware, addAttrsToPcl);
router.post("/pclattrs/update", authMiddleware, updateAttrPcl);
router.post("/pclattrs/delete", authMiddleware, deleteAttrPcl);
router.get("/pclattrs/entries", authMiddleware, getPclAttrEntries);

//product-attr 関連
router.get("/atrpr/list", authMiddleware, getProductAttrList);
router.post("/atrpr/update", authMiddleware, updateProductAttrs);
export default router;
