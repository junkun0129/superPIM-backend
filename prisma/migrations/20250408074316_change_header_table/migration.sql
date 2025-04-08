/*
  Warnings:

  - Added the required column `hdr_order` to the `header` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hdr_width` to the `header` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `header` ADD COLUMN `hdr_order` INTEGER NOT NULL,
    ADD COLUMN `hdr_width` VARCHAR(4) NOT NULL;
