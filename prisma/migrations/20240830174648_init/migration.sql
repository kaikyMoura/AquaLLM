-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "tb_measures" (
    "measure_uuid" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "confirmed_value" INTEGER,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" "MeasureType" NOT NULL,
    "customer_code" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,

    CONSTRAINT "tb_measures_pkey" PRIMARY KEY ("measure_uuid")
);
