ALTER TABLE "public"."UniformRecord"
  ALTER COLUMN "noPR" DROP NOT NULL;

ALTER TABLE "public"."UniformRecord"
  ADD COLUMN "batch" TEXT;