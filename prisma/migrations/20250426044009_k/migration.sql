/*
  Warnings:

  - Made the column `atr_control_type` on table `attr` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atr_select_list` on table `attr` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atr_default_value` on table `attr` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atr_unit` on table `attr` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `attr` MODIFY `atr_control_type` VARCHAR(255) NOT NULL,
    MODIFY `atr_select_list` TEXT NOT NULL,
    MODIFY `atr_default_value` VARCHAR(255) NOT NULL,
    MODIFY `atr_unit` VARCHAR(255) NOT NULL;
