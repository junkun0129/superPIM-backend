/*
  Warnings:

  - You are about to drop the column `wks_cd` on the `attrpcl` table. All the data in the column will be lost.
  - Made the column `atp_is_show` on table `attrpcl` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atp_is_common` on table `attrpcl` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `attrpcl` DROP FOREIGN KEY `AttrPcl_wks_cd_fkey`;

-- DropIndex
DROP INDEX `AttrPcl_wks_cd_fkey` ON `attrpcl`;

-- AlterTable
ALTER TABLE `attrpcl` DROP COLUMN `wks_cd`,
    MODIFY `atp_is_show` CHAR(1) NOT NULL,
    MODIFY `atp_is_common` CHAR(1) NOT NULL;
