import {
  checkProduct,
  createProduct,
  deleteProduct,
  getFilterdProductsList,
  getProductsList,
  updateProduct,
  updateProductStatus,
} from "controllers/product.controller";
import express from "express";
import { authMiddleware } from "middleware/auth.middleware";
const router = express.Router();

router.get("/get", authMiddleware, getProductsList);
router.get("/getfilter", authMiddleware, getFilterdProductsList);
router.post("/udpate", authMiddleware, updateProduct);
router.post("/delete", authMiddleware, deleteProduct);
router.post("/updatestats", authMiddleware, updateProductStatus);
router.post("/create", authMiddleware, createProduct);
router.post("/check", authMiddleware, checkProduct);

export default router;
