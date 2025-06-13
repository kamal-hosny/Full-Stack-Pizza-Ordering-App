-- CreateEnum
CREATE TYPE "ProductSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "name" "ProductSize" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "ProductId" TEXT NOT NULL,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_ProductId_fkey" FOREIGN KEY ("ProductId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
