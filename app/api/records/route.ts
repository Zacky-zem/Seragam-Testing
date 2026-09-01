import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const toDate = (value: unknown) => {
  if (!value) return null

  const date = new Date(value as string)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') || undefined
  const status = searchParams.get('status') || undefined
  const records = await prisma.uniformRecord.findMany({ where: { ...(status && status !== 'Semua' ? { status } : {}), ...(q ? { OR: [{ noPR: { contains: q, mode: 'insensitive' } }, { namaKaryawan: { contains: q, mode: 'insensitive' } }, { departemen: { contains: q, mode: 'insensitive' } }, { section: { contains: q, mode: 'insensitive' } }] } : {}) }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(records)
}
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Format data tidak valid.' }, { status: 400 })
  }

  const noPR = String(body.noPR ?? '').trim().toUpperCase()
  const namaKaryawan = String(body.namaKaryawan ?? '').trim()
  const departemen = String(body.departemen ?? '').trim()
  const jenisSeragam = String(body.jenisSeragam ?? '').trim()
  const jumlah = Number(body.jumlah ?? 1)
  if (!noPR || !namaKaryawan || !departemen || !jenisSeragam) {
    return NextResponse.json({ error: 'Field wajib belum lengkap' }, { status: 400 })
  }
  if (!Number.isInteger(jumlah) || jumlah < 1) {
    return NextResponse.json({ error: 'Jumlah stel harus berupa bilangan bulat minimal 1.' }, { status: 400 })
  }

  const existing = await prisma.uniformRecord.findUnique({ where: { noPR } })
  if (existing) {
    return NextResponse.json({ error: `Nomor PR ${body.noPR} sudah terdaftar. Silakan gunakan nomor PR lain atau edit data yang ada.` }, { status: 409 })
  }

  const tanggalPengajuan = toDate(body.tanggalPengajuan) ?? new Date()
  const tanggalPenerimaan = body.tanggalPenerimaan ? toDate(body.tanggalPenerimaan) : null

  try {
    const record = await prisma.uniformRecord.create({
      data: {
        noPR,
        namaKaryawan,
        nip: body.nip ? String(body.nip).trim() : null,
        departemen,
        section: body.section ? String(body.section).trim() : null,
        ukuran: body.ukuran ? String(body.ukuran) : 'M',
        ukuranCelana: body.ukuranCelana ? String(body.ukuranCelana) : null,
        jenisSeragam,
        jumlah,
        status: body.status ? String(body.status) : 'Diajukan',
        tanggalPengajuan,
        tanggalPenerimaan,
        keterangan: body.keterangan || null,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: `Nomor PR ${body.noPR} sudah terdaftar.` }, { status: 409 })
    }

    console.error('[v0] POST /api/records failed:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data seragam.', detail: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined }, { status: 500 })
  }
}
export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...payload } = body
  if (!id) return NextResponse.json({ error: 'ID data wajib diisi.' }, { status: 400 })

  const tanggalPengajuan = payload.tanggalPengajuan ? toDate(payload.tanggalPengajuan) : undefined
  const tanggalPenerimaan = payload.tanggalPenerimaan === null ? null : payload.tanggalPenerimaan ? toDate(payload.tanggalPenerimaan) : undefined

  try {
    const record = await prisma.uniformRecord.update({
      where: { id },
      data: {
        ...(payload.noPR !== undefined ? { noPR: String(payload.noPR).trim() } : {}),
        ...(payload.namaKaryawan !== undefined ? { namaKaryawan: String(payload.namaKaryawan).trim() } : {}),
        ...(payload.nip !== undefined ? { nip: payload.nip ? String(payload.nip).trim() : null } : {}),
        ...(payload.departemen !== undefined ? { departemen: String(payload.departemen).trim() } : {}),
        ...(payload.section !== undefined ? { section: payload.section ? String(payload.section).trim() : null } : {}),
        ...(payload.ukuran !== undefined ? { ukuran: String(payload.ukuran) } : {}),
        ...(payload.ukuranCelana !== undefined ? { ukuranCelana: payload.ukuranCelana ? String(payload.ukuranCelana) : null } : {}),
        ...(payload.jenisSeragam !== undefined ? { jenisSeragam: String(payload.jenisSeragam) } : {}),
        ...(payload.jumlah !== undefined ? { jumlah: Math.max(1, Number(payload.jumlah) || 1) } : {}),
        ...(payload.status !== undefined ? { status: String(payload.status) } : {}),
        ...(tanggalPengajuan ? { tanggalPengajuan } : {}),
        ...(tanggalPenerimaan !== undefined ? { tanggalPenerimaan } : {}),
        ...(payload.status === 'Diterima' && !payload.tanggalPenerimaan ? { tanggalPenerimaan: new Date() } : {}),
        ...(payload.keterangan !== undefined ? { keterangan: payload.keterangan ? String(payload.keterangan).trim() : null } : {}),
      },
    })

    return NextResponse.json(record)
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: `Nomor PR ${payload.noPR} sudah terdaftar.` }, { status: 409 })
    }

    return NextResponse.json({ error: 'Gagal memperbarui data seragam.' }, { status: 500 })
  }
}
export async function DELETE(request: Request) {
  const { id } = await request.json()
  await prisma.uniformRecord.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
