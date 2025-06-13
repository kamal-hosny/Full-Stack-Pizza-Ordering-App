-- CreateEnum
CREATE TYPE "ExtraIngredient" AS ENUM ('CHEESE', 'TOMATO', 'ONION', 'PEPPER', 'MUSHROOM', 'OLIVE', 'GARLIC', 'BASIL', 'SPINACH', 'CHICKEN', 'BEEF', 'SAUSAGE', 'PEPPERONI', 'HAM', 'PINEAPPLE');

-- CreateTable
CREATE TABLE "Extra" (
    "id" TEXT NOT NULL,
    "name" "ExtraIngredient" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "ProductId" TEXT NOT NULL,

    CONSTRAINT "Extra_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Extra" ADD CONSTRAINT "Extra_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
