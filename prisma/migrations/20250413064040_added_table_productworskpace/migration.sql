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

-- AddForeignKey
ALTER TABLE `productworkspace` ADD CONSTRAINT `productworkspace_pr_cd_fkey` FOREIGN KEY (`pr_cd`) REFERENCES `product`(`pr_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productworkspace` ADD CONSTRAINT `productworkspace_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;
