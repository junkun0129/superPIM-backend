/*
  Warnings:

  - You are about to drop the column `atp_default_order` on the `attrpcl` table. All the data in the column will be lost.
  - Made the column `atp_order` on table `attrpcl` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attrpcl` DROP COLUMN `atp_default_order`,
    MODIFY `atp_order` INTEGER NOT NULL;
