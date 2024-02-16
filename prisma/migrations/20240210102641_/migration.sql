-- DropForeignKey
ALTER TABLE "Dish" DROP CONSTRAINT "Dish_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sostav" TEXT NOT NULL DEFAULT 'Пирог картофельный(2 шт), Сироп банановый(7 шт)';
