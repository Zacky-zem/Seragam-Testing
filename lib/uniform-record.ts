import type { UniformRecord } from '@/types/seragam'

type ApiUniformRecord = Partial<{
  id: string
  noPR: string
  namaKaryawan: string
  nip: string
  departemen: string
  section: string
  ukuranBaju: string
  ukuran: string
  ukuranCelana: string
  jumlah: number
  tanggalPengajuan: string | Date
  tanggalPenerimaan: string | Date | null
  batch: string
  keterangan: string | null
}>

const toLocalDateInputValue = (value: string | Date) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export const normalizeRecord = (record: ApiUniformRecord): UniformRecord => ({
  id: record.id ?? record.noPR ?? '',
  namaKaryawan: record.namaKaryawan ?? 'Unknown',
  nik: record.nip ?? '',
  departemen: record.departemen ?? 'Unknown',
  section: record.section ?? '',
  ukuranBaju: record.ukuranBaju ?? record.ukuran ?? 'M',
  ukuranCelana: record.ukuranCelana ?? '',
  jumlahStel: Number(record.jumlah ?? 1),
  noPR: record.noPR ?? '',
  tglInput: record.tanggalPengajuan ? toLocalDateInputValue(record.tanggalPengajuan) : '',
  tglTerima: record.tanggalPenerimaan ? toLocalDateInputValue(record.tanggalPenerimaan) : null,
  batch: record.batch ?? '',
  keterangan: record.keterangan ?? undefined,
})

export const toApiPayload = (record: UniformRecord) => ({
  noPR: record.noPR || null,
  namaKaryawan: record.namaKaryawan,
  nip: record.nik,
  departemen: record.departemen,
  section: record.section,
  ukuranBaju: record.ukuranBaju,
  ukuranCelana: record.ukuranCelana,
  jumlah: record.jumlahStel,
  status: record.tglTerima ? 'Diterima' : 'Diajukan',
  tanggalPengajuan: record.tglInput || new Date().toISOString().split('T')[0],
  tanggalPenerimaan: record.tglTerima || null,
  batch: record.batch || null,
  keterangan: record.keterangan || null,
})
