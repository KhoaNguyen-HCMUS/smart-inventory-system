/*
  Warnings:

  - You are about to drop the column `locationFromId` on the `DocumentLine` table. All the data in the column will be lost.
  - You are about to drop the column `locationToId` on the `DocumentLine` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `StockLedger` table. All the data in the column will be lost.
  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DocumentLine" DROP CONSTRAINT "DocumentLine_locationFromId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentLine" DROP CONSTRAINT "DocumentLine_locationToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Location" DROP CONSTRAINT "Location_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLedger" DROP CONSTRAINT "StockLedger_locationId_fkey";

-- DropIndex
DROP INDEX "public"."StockLedger_productId_warehouseId_locationId_idx";

-- AlterTable
ALTER TABLE "DocumentLine" DROP COLUMN "locationFromId",
DROP COLUMN "locationToId";

-- AlterTable
ALTER TABLE "StockLedger" DROP COLUMN "locationId";

-- DropTable
DROP TABLE "public"."Location";
