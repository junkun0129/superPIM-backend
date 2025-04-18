/*
  Warnings:

  - You are about to drop the column `wks_cd` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_wks_cd_fkey`;

-- DropIndex
DROP INDEX `Product_wks_cd_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `wks_cd`;
