import {
  checkProduct,
  createProduct,
  deleteProduct,
  getFilterdProductsList,
  getProductDetail,
  getProductsList,
  updateProductStatus,
} from "../controllers/product.controller";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/list", authMiddleware, getProductsList);
router.get("/filteredlist", authMiddleware, getFilterdProductsList);
router.get("/detail/:pr_cd", authMiddleware, getProductDetail);
// router.post("/udpate", authMiddleware, updateProduct);
router.post("/delete", authMiddleware, deleteProduct);
router.post("/updatestats", authMiddleware, updateProductStatus);
router.post("/create", authMiddleware, createProduct);
router.post("/check", authMiddleware, checkProduct);

export default router;
