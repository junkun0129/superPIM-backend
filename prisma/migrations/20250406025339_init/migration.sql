/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_cd` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `email`,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    ADD COLUMN `user_cd` CHAR(36) NOT NULL,
    ADD COLUMN `user_email` VARCHAR(255) NOT NULL,
    ADD COLUMN `user_groups` VARCHAR(255) NULL,
    ADD COLUMN `user_name` VARCHAR(255) NOT NULL,
    ADD COLUMN `user_password` VARCHAR(255) NOT NULL,
    ADD PRIMARY KEY (`user_cd`);

-- DropTable
DROP TABLE `post`;

-- CreateTable
CREATE TABLE `Workspace` (
    `wks_cd` CHAR(36) NOT NULL,
    `wks_name` VARCHAR(255) NOT NULL,
    `wks_desc` TEXT NULL,
    `wks_created_by` CHAR(36) NOT NULL,
    `wks_created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`wks_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserWorkspace` (
    `usw_cd` CHAR(36) NOT NULL,
    `usw_created_at` DATETIME(3) NOT NULL,
    `user_cd` CHAR(36) NOT NULL,
    `wks_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`usw_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `pr_cd` CHAR(36) NOT NULL,
    `pr_name` VARCHAR(255) NOT NULL,
    `pr_is_discontinued` BOOLEAN NULL,
    `pr_acpt_status` VARCHAR(255) NULL,
    `pr_acpt_last_updated_at` DATETIME(3) NULL,
    `pr_labels` TEXT NULL,
    `pr_created_at` DATETIME(3) NOT NULL,
    `pr_updated_at` DATETIME(3) NULL,
    `pr_is_deleted` BOOLEAN NULL,
    `pr_is_series` BOOLEAN NULL,
    `pr_series_cd` CHAR(36) NULL,
    `pr_description` TEXT NULL,
    `pcl_cd` CHAR(36) NULL,
    `wks_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`pr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `ctg_cd` CHAR(36) NOT NULL,
    `ctg_name` VARCHAR(255) NOT NULL,
    `ctg_desc` TEXT NULL,
    `ctg_order` INTEGER NULL,
    `parent_cd` CHAR(36) NULL,

    PRIMARY KEY (`ctg_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrCategory` (
    `prc_cd` CHAR(36) NOT NULL,
    `ctg_cd` CHAR(36) NOT NULL,
    `pr_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`prc_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pcl` (
    `pcl_cd` CHAR(36) NOT NULL,
    `pcl_name` VARCHAR(255) NOT NULL,
    `pcl_created_at` DATETIME(3) NOT NULL,
    `pcl_is_deleted` BOOLEAN NULL,

    PRIMARY KEY (`pcl_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Header` (
    `hdr_cd` CHAR(36) NOT NULL,
    `attr_cd` CHAR(36) NOT NULL,
    `wks_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`hdr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attr` (
    `atr_cd` CHAR(36) NOT NULL,
    `atr_name` VARCHAR(255) NOT NULL,
    `atr_is_delete` BOOLEAN NULL,
    `atr_is_with_unit` BOOLEAN NULL,
    `atr_control_type` VARCHAR(255) NULL,
    `atr_not_null` BOOLEAN NULL,
    `atr_max_length` INTEGER NULL,
    `atr_select_list` TEXT NULL,
    `atr_default_value` VARCHAR(255) NULL,
    `atr_unit` VARCHAR(255) NULL,
    `atr_created_at` DATETIME(3) NOT NULL,
    `atr_updated_at` DATETIME(3) NULL,
    `atr_is_common` BOOLEAN NULL,

    PRIMARY KEY (`atr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttrValue` (
    `atv_cd` CHAR(36) NOT NULL,
    `atv_value` TEXT NULL,
    `pr_cd` CHAR(36) NOT NULL,
    `atr_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`atv_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttrPcl` (
    `atp_cd` CHAR(36) NOT NULL,
    `atp_order` VARCHAR(255) NULL,
    `atp_default_order` INTEGER NULL,
    `atp_is_show` BOOLEAN NULL,
    `atp_alter_name` VARCHAR(255) NULL,
    `atp_alter_value` VARCHAR(255) NULL,
    `atr_cd` CHAR(36) NOT NULL,
    `pcl_cd` CHAR(36) NOT NULL,

    PRIMARY KEY (`atp_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `ast_cd` CHAR(36) NOT NULL,
    `ast_type` VARCHAR(255) NULL,
    `ast_img` TEXT NULL,
    `ast_name` VARCHAR(255) NULL,
    `asb_cd` CHAR(36) NULL,
    `pr_cd` CHAR(36) NULL,
    `wks_cd` CHAR(36) NULL,

    PRIMARY KEY (`ast_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assetbox` (
    `asb_cd` CHAR(36) NOT NULL,
    `asb_ext` VARCHAR(255) NULL,
    `asb_is_main` BOOLEAN NULL,
    `asb_lbl` VARCHAR(255) NULL,
    `asb_type` VARCHAR(255) NULL,
    `wks_cd` CHAR(36) NULL,

    PRIMARY KEY (`asb_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserWorkspace` ADD CONSTRAINT `UserWorkspace_user_cd_fkey` FOREIGN KEY (`user_cd`) REFERENCES `User`(`user_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserWorkspace` ADD CONSTRAINT `UserWorkspace_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `Workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `Workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_pcl_cd_fkey` FOREIGN KEY (`pcl_cd`) REFERENCES `Pcl`(`pcl_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrCategory` ADD CONSTRAINT `PrCategory_ctg_cd_fkey` FOREIGN KEY (`ctg_cd`) REFERENCES `Category`(`ctg_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrCategory` ADD CONSTRAINT `PrCategory_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `Product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Header` ADD CONSTRAINT `Header_attr_cd_fkey` FOREIGN KEY (`attr_cd`) REFERENCES `Attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Header` ADD CONSTRAINT `Header_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `Workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttrValue` ADD CONSTRAINT `AttrValue_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `Product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttrValue` ADD CONSTRAINT `AttrValue_atr_cd_fkey` FOREIGN KEY (`atr_cd`) REFERENCES `Attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttrPcl` ADD CONSTRAINT `AttrPcl_atr_cd_fkey` FOREIGN KEY (`atr_cd`) REFERENCES `Attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttrPcl` ADD CONSTRAINT `AttrPcl_pcl_cd_fkey` FOREIGN KEY (`pcl_cd`) REFERENCES `Pcl`(`pcl_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_asb_cd_fkey` FOREIGN KEY (`asb_cd`) REFERENCES `Assetbox`(`asb_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `Product`(`pr_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `Workspace`(`wks_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assetbox` ADD CONSTRAINT `Assetbox_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `Workspace`(`wks_cd`) ON DELETE SET NULL ON UPDATE CASCADE;
