-- DropForeignKey
ALTER TABLE `header` DROP FOREIGN KEY `Header_wks_cd_fkey`;

-- AlterTable
ALTER TABLE `header` MODIFY `wks_cd` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `header` ADD CONSTRAINT `Header_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE SET NULL ON UPDATE CASCADE;
