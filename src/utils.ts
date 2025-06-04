import { Request } from "express";

import jwt from "jsonwebtoken";

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const getUserCd = (req: Request) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return "";
  const decoded = jwt.decode(token);
  if (!decoded) return "";
  if (typeof decoded === "string") return "";
  const userId = decoded.user_cd;
  return userId;
};

export const normalizeBoolean = (value: any): boolean | null => {
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  if (value === true || value === false) return value;
  return null;
};
