import {
  createPrice,
  deletePrice,
  getProductPriceList,
  updatePrice,
} from "../controllers/price.controller";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/get/:pr_cd", authMiddleware, getProductPriceList);
router.post("/create", authMiddleware, createPrice);
router.post("/delete/:pes_cd", authMiddleware, deletePrice);
router.post("/update/:pes_cd", authMiddleware, updatePrice);

export default router;
