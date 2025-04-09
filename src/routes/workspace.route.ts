import {
  createWorkspace,
  getWorkspaces,
} from "controllers/workspace.controller";
import express from "express";
import { authMiddleware } from "middleware/auth.middleware";
const router = express.Router();
router.get("/get", authMiddleware, getWorkspaces);
router.post("/create", authMiddleware, createWorkspace);

export default router;
