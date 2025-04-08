import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { user } from "@prisma/client";
import { jwt as jwtConfig, table } from "../config";
import { generateRandomString } from "../utils";

// Helper function to generate JWT token
const generateToken = (user: {
  user_email: string;
  user_cd: string;
}): string => {
  const payload = { email: user.user_email, user_cd: user.user_cd };
  return jwt.sign(payload, jwtConfig.secret, {
    algorithm: "HS256",
  });
};

// Helper function to format user response
const formatUserResponse = (user: user) => ({
  email: user.user_email,
  username: user.user_name,
  cd: user.user_cd,
});

// SignUp Controller
export const signUpController: RequestHandler = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    // Check if user exists

    const existingUser = await prisma.user.findFirst({
      where: { user_email: email },
    });

    console.log(existingUser, "existingUser");

    if (existingUser) {
      res.status(409).json({
        message: "同じメールアドレスがすでに使われています",
        result: "failed",
      });
      return;
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user_cd = generateRandomString(36);

    const newUser = await prisma.user.create({
      data: {
        user_email: email,
        user_password: hashedPassword,
        user_name: username,
        user_cd: user_cd,
      },
    });

    res.status(201).json({
      message: "ユーザーの登録に成功しました",
      result: "success",
      data: formatUserResponse(newUser),
    });
  } catch (error) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: error,
    });
  }
};

// SignIn Controller
export const signinController: RequestHandler = async (req, res) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    // Find user
    const user = await prisma.user.findFirst({
      where: { user_email: email },
    });
    if (!user) {
      res.status(401).json({
        message: "そのメールアドレスで登録されているアカウントはありません",
        result: "failed",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.user_password);
    if (!isValidPassword) {
      res.status(401).json({
        message: "パスワードが違います",
        result: "failed",
      });
      return;
    }

    // Generate token and send response
    const token = generateToken(user);
    res.status(200).json({
      message: "ログインに成功しました",
      result: "success",
      data: {
        user: formatUserResponse(user),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "ログイン処理中にエラーが発生しました",
      result: "failed",
    });
  }
};
