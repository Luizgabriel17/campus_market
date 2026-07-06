-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "recipient" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "notes" TEXT;
