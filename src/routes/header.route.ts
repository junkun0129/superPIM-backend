import {
  addHeader,
  deleteHeader,
  getHeaders,
  updateHeaderOrder,
  updateHeaderWidth,
} from "../controllers/header.controller";
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/get", authMiddleware, getHeaders);
router.post("/add", authMiddleware, addHeader);
router.post("/delete/:hdr_cd", authMiddleware, deleteHeader);
router.post("/updateorder", authMiddleware, updateHeaderOrder);
router.post("/updatewidth", authMiddleware, updateHeaderWidth);

export default router;
