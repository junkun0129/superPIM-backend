import {
  createCategory,
  deleteCategory,
  getCategories,
  getProductCategories,
  saveProductCategory,
  updateCategoryOrder,
} from "../controllers/category.controller";

import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/get", authMiddleware, getProductCategories);
router.post("/save", authMiddleware, saveProductCategory);
router.post("/create", authMiddleware, createCategory);
router.post("/delete", authMiddleware, deleteCategory);
router.post("/updateorder", authMiddleware, updateCategoryOrder);
router.get("/list", authMiddleware, getCategories);
export default router;
