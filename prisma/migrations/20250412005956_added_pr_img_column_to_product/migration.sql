/*
  Warnings:

  - Added the required column `pr_img` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `pr_img` VARCHAR(255) NOT NULL;
