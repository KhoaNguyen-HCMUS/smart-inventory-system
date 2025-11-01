/*
  Warnings:

  - The values [ADJUST_POS,ADJUST_NEG] on the enum `MoveReason` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdById` on the `StockMove` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseId` on the `StockMove` table. All the data in the column will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StockMove` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayType" AS ENUM ('CASH', 'CREDIT');

-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('BILL', 'PAYMENT', 'ADJUST');

-- AlterEnum
BEGIN;
CREATE TYPE "MoveReason_new" AS ENUM ('IN', 'OUT', 'ADJUST');
ALTER TABLE "StockMove" ALTER COLUMN "reason" TYPE "MoveReason_new" USING ("reason"::text::"MoveReason_new");
ALTER TYPE "MoveReason" RENAME TO "MoveReason_old";
ALTER TYPE "MoveReason_new" RENAME TO "MoveReason";
DROP TYPE "public"."MoveReason_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockMove" DROP CONSTRAINT "StockMove_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockMove" DROP CONSTRAINT "StockMove_warehouseId_fkey";

-- DropIndex
DROP INDEX "public"."Product_name_idx";

-- DropIndex
DROP INDEX "public"."StockMove_createdAt_idx";

-- DropIndex
DROP INDEX "public"."StockMove_productId_warehouseId_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "unitCode" SET DEFAULT 'pcs';

-- AlterTable
ALTER TABLE "StockMove" DROP COLUMN "createdById",
DROP COLUMN "warehouseId",
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "payType" "PayType",
ADD COLUMN     "supplierId" TEXT,
ADD COLUMN     "unitPrice" DECIMAL(18,2),
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."AuditLog";

-- DropTable
DROP TABLE "public"."Warehouse";

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "allowDebt" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayableLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "amountDelta" DECIMAL(18,2) NOT NULL,
    "note" TEXT,
    "refMoveId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayableLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Supplier_userId_name_idx" ON "Supplier"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_userId_name_key" ON "Supplier"("userId", "name");

-- CreateIndex
CREATE INDEX "Customer_userId_name_idx" ON "Customer"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_name_key" ON "Customer"("userId", "name");

-- CreateIndex
CREATE INDEX "PayableLedger_userId_supplierId_idx" ON "PayableLedger"("userId", "supplierId");

-- CreateIndex
CREATE INDEX "PayableLedger_userId_createdAt_idx" ON "PayableLedger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Product_userId_name_idx" ON "Product"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_userId_name_key" ON "Product"("userId", "name");

-- CreateIndex
CREATE INDEX "StockMove_userId_productId_idx" ON "StockMove"("userId", "productId");

-- CreateIndex
CREATE INDEX "StockMove_userId_createdAt_idx" ON "StockMove"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "StockMove_userId_supplierId_idx" ON "StockMove"("userId", "supplierId");

-- CreateIndex
CREATE INDEX "StockMove_userId_customerId_idx" ON "StockMove"("userId", "customerId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMove" ADD CONSTRAINT "StockMove_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableLedger" ADD CONSTRAINT "PayableLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableLedger" ADD CONSTRAINT "PayableLedger_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableLedger" ADD CONSTRAINT "PayableLedger_refMoveId_fkey" FOREIGN KEY ("refMoveId") REFERENCES "StockMove"("id") ON DELETE SET NULL ON UPDATE CASCADE;
