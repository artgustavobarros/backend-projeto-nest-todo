/*
  Warnings:

  - You are about to alter the column `status` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(0))`.
  - Added the required column `category` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `category` ENUM('green', 'yellow', 'red') NOT NULL,
    MODIFY `status` ENUM('done', 'undone') NOT NULL;
