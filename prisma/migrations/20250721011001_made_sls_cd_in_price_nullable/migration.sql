-- DropForeignKey
ALTER TABLE `price` DROP FOREIGN KEY `price_sls_cd_fkey`;

-- AlterTable
ALTER TABLE `price` MODIFY `sls_cd` CHAR(36) NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `pr_jan` VARCHAR(13) NULL;

-- AddForeignKey
ALTER TABLE `price` ADD CONSTRAINT `price_sls_cd_fkey` FOREIGN KEY (`sls_cd`) REFERENCES `sale`(`sls_cd`) ON DELETE SET NULL ON UPDATE CASCADE;
