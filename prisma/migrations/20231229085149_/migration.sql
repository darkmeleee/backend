-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'ONLINE';
