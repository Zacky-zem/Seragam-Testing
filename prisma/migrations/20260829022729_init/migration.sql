-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UniformRecord" (
    "id" TEXT NOT NULL,
    "noPR" TEXT NOT NULL,
    "namaKaryawan" TEXT NOT NULL,
    "nip" TEXT,
    "departemen" TEXT NOT NULL,
    "ukuran" TEXT NOT NULL,
    "jenisSeragam" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "tanggalPengajuan" TIMESTAMP(3),
    "tanggalPenerimaan" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Diajukan',
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniformRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UniformRecord_noPR_key" ON "public"."UniformRecord"("noPR");

-- CreateIndex
CREATE INDEX "UniformRecord_namaKaryawan_idx" ON "public"."UniformRecord"("namaKaryawan");

-- CreateIndex
CREATE INDEX "UniformRecord_departemen_idx" ON "public"."UniformRecord"("departemen");

-- CreateIndex
CREATE INDEX "UniformRecord_status_idx" ON "public"."UniformRecord"("status");

-- CreateIndex
CREATE INDEX "UniformRecord_tanggalPengajuan_idx" ON "public"."UniformRecord"("tanggalPengajuan");
