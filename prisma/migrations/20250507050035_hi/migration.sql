-- CreateTable
CREATE TABLE `asset` (
    `ast_cd` CHAR(36) NOT NULL,
    `ast_type` CHAR(1) NOT NULL,
    `ast_img` TEXT NOT NULL,
    `ast_ext` CHAR(4) NOT NULL,
    `asb_key` VARCHAR(255) NOT NULL,
    `pr_cd` CHAR(36) NOT NULL,

    INDEX `Asset_asb_key_fkey`(`asb_key`),
    INDEX `Asset_pr_cd_fkey`(`pr_cd`),
    UNIQUE INDEX `Asset_pr_cd_asb_key_unique`(`pr_cd`, `asb_key`),
    PRIMARY KEY (`ast_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assetbox` (
    `asb_cd` CHAR(36) NOT NULL,
    `asb_key` VARCHAR(255) NOT NULL,
    `asb_is_main` BOOLEAN NULL,
    `asb_name` VARCHAR(255) NOT NULL,
    `asb_type` VARCHAR(255) NULL,

    UNIQUE INDEX `assetbox_asb_key_key`(`asb_key`),
    PRIMARY KEY (`asb_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attr` (
    `atr_cd` CHAR(36) NOT NULL,
    `atr_name` VARCHAR(255) NOT NULL,
    `atr_is_delete` CHAR(1) NOT NULL,
    `atr_is_with_unit` CHAR(1) NOT NULL,
    `atr_control_type` VARCHAR(255) NOT NULL,
    `atr_not_null` CHAR(1) NOT NULL,
    `atr_max_length` INTEGER NULL,
    `atr_select_list` TEXT NOT NULL,
    `atr_default_value` VARCHAR(255) NOT NULL,
    `atr_unit` VARCHAR(255) NOT NULL,
    `atr_created_at` DATETIME(3) NOT NULL,
    `atr_updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`atr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attrpcl` (
    `atp_cd` CHAR(36) NOT NULL,
    `atp_order` INTEGER NOT NULL,
    `atp_is_show` CHAR(1) NOT NULL,
    `atp_alter_name` VARCHAR(255) NULL,
    `atp_is_common` CHAR(1) NOT NULL,
    `atr_cd` CHAR(36) NOT NULL,
    `pcl_cd` CHAR(36) NOT NULL,

    INDEX `AttrPcl_atr_cd_fkey`(`atr_cd`),
    INDEX `AttrPcl_pcl_cd_fkey`(`pcl_cd`),
    PRIMARY KEY (`atp_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attrvalue` (
    `atv_cd` CHAR(36) NOT NULL,
    `atv_value` TEXT NULL,
    `pr_cd` CHAR(36) NOT NULL,
    `atr_cd` CHAR(36) NOT NULL,

    INDEX `AttrValue_atr_cd_fkey`(`atr_cd`),
    INDEX `AttrValue_pr_cd_fkey`(`pr_cd`),
    PRIMARY KEY (`atv_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `ctg_cd` CHAR(36) NOT NULL,
    `ctg_name` VARCHAR(255) NOT NULL,
    `ctg_desc` TEXT NULL,
    `ctg_order` INTEGER NULL,
    `parent_cd` CHAR(36) NULL,

    PRIMARY KEY (`ctg_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `header` (
    `hdr_cd` CHAR(36) NOT NULL,
    `attr_cd` CHAR(36) NOT NULL,
    `wks_cd` CHAR(36) NULL,
    `hdr_width` INTEGER NOT NULL,
    `hdr_order` INTEGER NOT NULL,

    INDEX `Header_attr_cd_fkey`(`attr_cd`),
    INDEX `Header_wks_cd_fkey`(`wks_cd`),
    PRIMARY KEY (`hdr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pcl` (
    `pcl_cd` CHAR(36) NOT NULL,
    `pcl_name` VARCHAR(255) NOT NULL,
    `pcl_created_at` DATETIME(3) NOT NULL,
    `pcl_is_deleted` CHAR(1) NOT NULL,

    PRIMARY KEY (`pcl_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `pr_cd` CHAR(36) NOT NULL,
    `pr_name` VARCHAR(255) NOT NULL,
    `pr_hinban` VARCHAR(255) NOT NULL,
    `pr_is_discontinued` CHAR(1) NOT NULL,
    `pr_acpt_status` INTEGER NOT NULL DEFAULT 0,
    `pr_acpt_last_updated_at` DATETIME(3) NULL,
    `pr_labels` TEXT NOT NULL,
    `pr_img` VARCHAR(255) NOT NULL,
    `pr_created_at` DATETIME(3) NOT NULL,
    `pr_updated_at` DATETIME(3) NULL,
    `pr_is_deleted` CHAR(1) NOT NULL,
    `pr_is_series` CHAR(1) NOT NULL,
    `pr_series_cd` CHAR(36) NOT NULL,
    `pr_description` TEXT NOT NULL,
    `pcl_cd` CHAR(36) NOT NULL,

    INDEX `Product_pcl_cd_fkey`(`pcl_cd`),
    PRIMARY KEY (`pr_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_cd` CHAR(36) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `user_groups` VARCHAR(255) NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`user_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userworkspace` (
    `usw_cd` CHAR(36) NOT NULL,
    `usw_created_at` DATETIME(3) NOT NULL,
    `usw_status` CHAR(1) NOT NULL,
    `user_cd` CHAR(36) NOT NULL,
    `wks_cd` CHAR(36) NOT NULL,

    INDEX `UserWorkspace_user_cd_fkey`(`user_cd`),
    INDEX `UserWorkspace_wks_cd_fkey`(`wks_cd`),
    PRIMARY KEY (`usw_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workspace` (
    `wks_cd` CHAR(36) NOT NULL,
    `wks_name` VARCHAR(255) NOT NULL,
    `wks_desc` TEXT NULL,
    `wks_created_by` CHAR(36) NOT NULL,
    `wks_created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`wks_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productworkspace` (
    `prw_cd` CHAR(36) NOT NULL,
    `pr_cd` CHAR(36) NOT NULL,
    `wks_cd` CHAR(36) NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductWorkspace_pr_cd_fkey`(`pr_cd`),
    INDEX `ProductWorkspace_wks_cd_fkey`(`wks_cd`),
    UNIQUE INDEX `productworkspace_pr_cd_wks_cd_key`(`pr_cd`, `wks_cd`),
    PRIMARY KEY (`prw_cd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProductCategory` (
    `A` CHAR(36) NOT NULL,
    `B` CHAR(36) NOT NULL,

    UNIQUE INDEX `_ProductCategory_AB_unique`(`A`, `B`),
    INDEX `_ProductCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `Asset_asb_key_fkey` FOREIGN KEY (`asb_key`) REFERENCES `assetbox`(`asb_key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset` ADD CONSTRAINT `Asset_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attrpcl` ADD CONSTRAINT `AttrPcl_atr_cd_fkey` FOREIGN KEY (`atr_cd`) REFERENCES `attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attrpcl` ADD CONSTRAINT `AttrPcl_pcl_cd_fkey` FOREIGN KEY (`pcl_cd`) REFERENCES `pcl`(`pcl_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attrvalue` ADD CONSTRAINT `AttrValue_atr_cd_fkey` FOREIGN KEY (`atr_cd`) REFERENCES `attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attrvalue` ADD CONSTRAINT `AttrValue_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_parent_cd_fkey` FOREIGN KEY (`parent_cd`) REFERENCES `category`(`ctg_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `Header_attr_cd_fkey` FOREIGN KEY (`attr_cd`) REFERENCES `attr`(`atr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `Header_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `Product_pcl_cd_fkey` FOREIGN KEY (`pcl_cd`) REFERENCES `pcl`(`pcl_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `UserWorkspace_user_cd_fkey` FOREIGN KEY (`user_cd`) REFERENCES `user`(`user_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `UserWorkspace_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productworkspace` ADD CONSTRAINT `productworkspace_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productworkspace` ADD CONSTRAINT `productworkspace_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`ctg_cd`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductCategory` ADD CONSTRAINT `_ProductCategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `product`(`pr_cd`) ON DELETE CASCADE ON UPDATE CASCADE;
