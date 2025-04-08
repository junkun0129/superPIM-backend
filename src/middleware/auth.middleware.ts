import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwt as jwtConfig } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "トークンが見つかりません" });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    // You can optionally attach user info to request object
    // (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "認証できません" });
  }
};
