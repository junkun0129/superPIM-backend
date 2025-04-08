/*
  Warnings:

  - You are about to drop the column `atr_is_common` on the `attr` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `attr` DROP COLUMN `atr_is_common`;

-- AlterTable
ALTER TABLE `attrpcl` ADD COLUMN `atp_is_common` BOOLEAN NULL;
