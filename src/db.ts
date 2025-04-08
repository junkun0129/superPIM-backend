import mysql, { Connection } from "mysql";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Export connection and config for use in other files
