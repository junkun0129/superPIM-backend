/*
  Warnings:

  - Added the required column `pr_jan` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `pr_jan` VARCHAR(13) NOT NULL;

-- AlterTable
ALTER TABLE `sale` ADD COLUMN `sls_note` VARCHAR(255) NULL;
