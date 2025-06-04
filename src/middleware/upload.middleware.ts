import express, { Request } from "express";
import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    const { asb } = req.params;
    const uploadPath = "assets/" + asb;

    if (!fs.existsSync(uploadPath)) {
      return cb(new Error("指定されたディレクトリが存在しません"), "");
    }
    fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    const { pr } = req.params;
    const ext = path.extname(file.originalname);
    const filename = pr + ext;
    cb(null, filename);
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "text/plain",
  "video/mp4",
];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
export const assetUploadMiddleware = multer({ storage, fileFilter });
