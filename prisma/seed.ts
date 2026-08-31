import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', name: 'Administrator', passwordHash: await bcrypt.hash('admin123', 10) } })
  const rows = [
    ['PR-2026-001','Ahmad Fauzan','JAI-001','Produksi','L','Wearpack','2','Diterima'],
    ['PR-2026-002','Siti Rahmawati','JAI-014','Quality Control','M','Kemeja Kerja','1','Diajukan'],
    ['PR-2026-003','Budi Santoso','JAI-022','Engineering','XL','Celana Kerja','2','Diproses'],
    ['PR-2026-004','Dewi Lestari','JAI-031','Warehouse','S','Jaket Safety','1','Diterima'],
  ]
  for (const [noPR,namaKaryawan,nip,departemen,ukuran,jenisSeragam,jumlah,status] of rows) await prisma.uniformRecord.upsert({ where: { noPR }, update: {}, create: { noPR,namaKaryawan,nip,departemen,ukuran,jenisSeragam,jumlah: Number(jumlah),status,tanggalPengajuan: new Date() } })
}
main().finally(() => prisma.$disconnect())
