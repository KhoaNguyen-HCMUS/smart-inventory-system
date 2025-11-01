/*
  Warnings:

  - You are about to drop the column `barcode` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `reorderLevel` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentLine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IdempotencyKey` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Partner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RoleEntity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MoveReason" AS ENUM ('IN', 'OUT', 'ADJUST_POS', 'ADJUST_NEG');

-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_partnerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_warehouseFromId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Document" DROP CONSTRAINT "Document_warehouseToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentLine" DROP CONSTRAINT "DocumentLine_documentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DocumentLine" DROP CONSTRAINT "DocumentLine_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_unitId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLedger" DROP CONSTRAINT "StockLedger_documentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLedger" DROP CONSTRAINT "StockLedger_lineId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLedger" DROP CONSTRAINT "StockLedger_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockLedger" DROP CONSTRAINT "StockLedger_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropIndex
DROP INDEX "public"."Product_barcode_idx";

-- DropIndex
DROP INDEX "public"."Product_barcode_key";

-- DropIndex
DROP INDEX "public"."Product_sku_idx";

-- DropIndex
DROP INDEX "public"."Product_sku_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "barcode",
DROP COLUMN "categoryId",
DROP COLUMN "reorderLevel",
DROP COLUMN "sku",
DROP COLUMN "unitId",
ADD COLUMN     "unitCode" TEXT NOT NULL DEFAULT 'cái';

-- DropTable
DROP TABLE "public"."Category";

-- DropTable
DROP TABLE "public"."Document";

-- DropTable
DROP TABLE "public"."DocumentLine";

-- DropTable
DROP TABLE "public"."IdempotencyKey";

-- DropTable
DROP TABLE "public"."Partner";

-- DropTable
DROP TABLE "public"."RoleEntity";

-- DropTable
DROP TABLE "public"."StockLedger";

-- DropTable
DROP TABLE "public"."Unit";

-- DropTable
DROP TABLE "public"."UserRole";

-- DropEnum
DROP TYPE "public"."DocumentStatus";

-- DropEnum
DROP TYPE "public"."DocumentType";

-- DropEnum
DROP TYPE "public"."PartnerType";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "StockMove" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "warehouseId" TEXT,
    "qtyDelta" DECIMAL(18,3) NOT NULL,
    "reason" "MoveReason" NOT NULL,
    "note" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StockMove_productId_warehouseId_idx" ON "StockMove"("productId", "warehouseId");

-- CreateIndex
CREATE INDEX "StockMove_createdAt_idx" ON "StockMove"("createdAt");

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
