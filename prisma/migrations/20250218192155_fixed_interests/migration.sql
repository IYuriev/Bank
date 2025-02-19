/*
  Warnings:

  - You are about to alter the column `interest` on the `deposits` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "deposits" ALTER COLUMN "interest" SET DATA TYPE DOUBLE PRECISION;
