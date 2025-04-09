/*
  Warnings:

  - You are about to drop the column `wks_cd` on the `asset` table. All the data in the column will be lost.
  - You are about to drop the column `asb_ext` on the `assetbox` table. All the data in the column will be lost.
  - You are about to drop the column `wks_cd` on the `assetbox` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `asset` DROP FOREIGN KEY `Asset_wks_cd_fkey`;

-- DropForeignKey
ALTER TABLE `assetbox` DROP FOREIGN KEY `Assetbox_wks_cd_fkey`;

-- DropIndex
DROP INDEX `Asset_wks_cd_fkey` ON `asset`;

-- DropIndex
DROP INDEX `Assetbox_wks_cd_fkey` ON `assetbox`;

-- AlterTable
ALTER TABLE `asset` DROP COLUMN `wks_cd`;

-- AlterTable
ALTER TABLE `assetbox` DROP COLUMN `asb_ext`,
    DROP COLUMN `wks_cd`;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parent_cd_fkey` FOREIGN KEY (`parent_cd`) REFERENCES `category`(`ctg_cd`) ON DELETE SET NULL ON UPDATE CASCADE;
