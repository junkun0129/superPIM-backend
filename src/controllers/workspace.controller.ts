import { resultMessage } from "config";
import { prisma } from "db";
import { Request, RequestHandler, Response } from "express";
import { generateRandomString } from "utils";

export const getWorkspaces: RequestHandler = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany();

    res.status(200).json({
      message: "ワークスペースの取得に成功しました",
      result: resultMessage.success,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};

export const createWorkspace: RequestHandler = async (req, res) => {
  try {
    const {
      name,
      wks_desc,
      wks_created_by,
    }: { name: string; wks_desc: string; wks_created_by: string } = req.body;

    // Check if workspace already exists
    const existingWorkspace = await prisma.workspace.findFirst({
      where: { wks_name: name },
    });
    if (existingWorkspace) {
      res.status(409).json({
        message: "ワークスペースはすでに存在します",
        result: resultMessage.alreadyExists,
      });
      return;
    }

    // Create new workspace
    const newWorkspace = await prisma.workspace.create({
      data: {
        wks_cd: generateRandomString(36),
        wks_name: name,
        wks_desc,
        wks_created_at: new Date(),
        wks_created_by,
      },
    });

    res.status(201).json({
      message: "ワークスペースの作成に成功しました",
      result: resultMessage.success,
      data: newWorkspace,
    });
  } catch (error) {
    res.status(500).json({
      message: "データベースとの接続に失敗しました",
      result: resultMessage.failed,
    });
  }
};
