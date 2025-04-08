import { getProductCategories } from "controllers/category.controller";

import express from "express";
import { authMiddleware } from "middleware/auth.middleware";
const router = express.Router();

router.get("/product/list", authMiddleware, getProductCategories);
router.post("/product/save", authMiddleware, getProductCategories);
router.post("/product/create", authMiddleware, getProductCategories);
router.post("/product/update", authMiddleware, getProductCategories);
router.post("/product/delete", authMiddleware, getProductCategories);

export default router;
