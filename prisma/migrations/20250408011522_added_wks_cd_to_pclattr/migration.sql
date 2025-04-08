/*
  Warnings:

  - Added the required column `wks_cd` to the `attrpcl` table without a default value. This is not possible if the table is not empty.
  - Made the column `pr_acpt_status` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attrpcl` ADD COLUMN `wks_cd` CHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `pr_acpt_status` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX `AttrPcl_wks_cd_fkey` ON `attrpcl`(`wks_cd`);

-- AddForeignKey
ALTER TABLE `attrpcl` ADD CONSTRAINT `AttrPcl_wks_cd_fkey` FOREIGN KEY (`wks_cd`) REFERENCES `workspace`(`wks_cd`) ON DELETE RESTRICT ON UPDATE CASCADE;
