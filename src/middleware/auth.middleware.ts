import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { jwt as jwtConfig } from "../config";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "トークンが見つかりません" });
      return;
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    // You can optionally attach user info to request object
    // (req as any).user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ message: "認証できません" });
  }
};
