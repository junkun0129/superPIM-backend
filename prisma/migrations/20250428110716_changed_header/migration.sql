/*
  Warnings:

  - You are about to alter the column `hdr_width` on the `header` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4)` to `Int`.

*/
-- AlterTable
ALTER TABLE `header` MODIFY `hdr_width` INTEGER NOT NULL;
