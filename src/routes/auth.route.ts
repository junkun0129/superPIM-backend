import {
  signinController,
  signUpController,
} from "../controllers/auth.controller";

const router = require("express").Router();

router.post("/signup", signUpController);
router.post("/signin", signinController);

export default router;
