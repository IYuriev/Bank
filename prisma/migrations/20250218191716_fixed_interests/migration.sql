/*
  Warnings:

  - You are about to alter the column `interest` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "interest" SET DATA TYPE DECIMAL(65,30);
