/*
  Warnings:

  - Made the column `pcl_is_deleted` on table `pcl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `pcl` MODIFY `pcl_is_deleted` CHAR(1) NOT NULL;
