import {
  signinController,
  signUpController,
} from "../controllers/auth.controller";

import express from "express";
const router = express.Router();

router.post("/signup", signUpController);
router.post("/signin", signinController);

export default router;
