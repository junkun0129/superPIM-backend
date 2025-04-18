/*
  Warnings:

  - Made the column `atr_is_delete` on table `attr` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atr_is_with_unit` on table `attr` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atr_not_null` on table `attr` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attr` MODIFY `atr_is_delete` CHAR(1) NOT NULL,
    MODIFY `atr_is_with_unit` CHAR(1) NOT NULL,
    MODIFY `atr_not_null` CHAR(1) NOT NULL;
