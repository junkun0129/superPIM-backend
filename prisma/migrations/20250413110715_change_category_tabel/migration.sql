/*
  Warnings:

  - You are about to drop the `prcategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `prcategory` DROP FOREIGN KEY `PrCategory_ctg_cd_fkey`;

-- DropForeignKey
ALTER TABLE `prcategory` DROP FOREIGN KEY `PrCategory_pr_cd_fkey`;

-- DropTable
DROP TABLE `prcategory`;

-- CreateTable
CREATE TABLE `_ProductCategory` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_ProductCategory_AB_unique`(`A`, `B`),
    INDEX `_ProductCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`ctg_cd`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `product`(`pr_cd`) ON DELETE CASCADE ON UPDATE CASCADE;
