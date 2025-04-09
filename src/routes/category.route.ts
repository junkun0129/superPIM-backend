import {
  createCategory,
  getCategories,
  getProductCategories,
  saveProductCategory,
  updateCategoryOrder,
} from "controllers/category.controller";

import express from "express";
import { authMiddleware } from "middleware/auth.middleware";
const router = express.Router();

router.get("/list", authMiddleware, getProductCategories);
router.post("/save", authMiddleware, saveProductCategory);
router.post("/create", authMiddleware, createCategory);
router.post("/updateorder", authMiddleware, updateCategoryOrder);
router.get("/get", authMiddleware, getCategories);
export default router;
