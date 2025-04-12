/*
  Warnings:

  - You are about to drop the column `asb_lbl` on the `assetbox` table. All the data in the column will be lost.
  - Added the required column `asb_name` to the `assetbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assetbox` DROP COLUMN `asb_lbl`,
    ADD COLUMN `asb_name` VARCHAR(255) NOT NULL;
