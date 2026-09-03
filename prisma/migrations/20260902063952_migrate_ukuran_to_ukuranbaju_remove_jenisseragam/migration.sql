/*
  Warnings:

  - You are about to drop the column `jenisSeragam` on the `UniformRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ukuran` on the `UniformRecord` table. All the data in the column will be lost.
  - Added the required column `ukuranBaju` to the `UniformRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UniformRecord" ADD COLUMN "ukuranBaju" TEXT;

-- Copy data from ukuran to ukuranBaju
UPDATE "public"."UniformRecord" SET "ukuranBaju" = "ukuran" WHERE "ukuran" IS NOT NULL;

-- Set default value for any null values
UPDATE "public"."UniformRecord" SET "ukuranBaju" = 'M' WHERE "ukuranBaju" IS NULL;

-- Make ukuranBaju NOT NULL
ALTER TABLE "public"."UniformRecord" ALTER COLUMN "ukuranBaju" SET NOT NULL;

-- Drop old columns
ALTER TABLE "public"."UniformRecord" DROP COLUMN "jenisSeragam";
ALTER TABLE "public"."UniformRecord" DROP COLUMN "ukuran";
