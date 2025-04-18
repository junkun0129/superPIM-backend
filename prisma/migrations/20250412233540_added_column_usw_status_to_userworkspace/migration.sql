/*
  Warnings:

  - Added the required column `usw_status` to the `userworkspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userworkspace` ADD COLUMN `usw_status` CHAR(1) NOT NULL;
