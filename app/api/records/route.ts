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
  const body = await request.json()
  if (!body.noPR || !body.namaKaryawan || !body.departemen || !body.jenisSeragam) {
    return NextResponse.json({ error: 'Field wajib belum lengkap' }, { status: 400 })
  }

  const existing = await prisma.uniformRecord.findUnique({ where: { noPR: body.noPR } })
  if (existing) {
    return NextResponse.json({ error: `Nomor PR ${body.noPR} sudah terdaftar. Silakan gunakan nomor PR lain atau edit data yang ada.` }, { status: 409 })
  }

  const tanggalPengajuan = toDate(body.tanggalPengajuan) ?? new Date()
  const tanggalPenerimaan = body.tanggalPenerimaan ? toDate(body.tanggalPenerimaan) : null

  try {
    const record = await prisma.uniformRecord.create({
      data: {
        noPR: body.noPR,
        namaKaryawan: body.namaKaryawan,
        nip: body.nip || null,
        departemen: body.departemen,
        section: body.section || null,
        ukuran: body.ukuran || 'M',
        jenisSeragam: body.jenisSeragam,
        jumlah: Number(body.jumlah) || 1,
        status: body.status || 'Diajukan',
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

    return NextResponse.json({ error: 'Gagal menyimpan data seragam.' }, { status: 500 })
  }
}
export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...payload } = body

  const tanggalPengajuan = payload.tanggalPengajuan ? toDate(payload.tanggalPengajuan) : undefined
  const tanggalPenerimaan = payload.tanggalPenerimaan === null ? null : payload.tanggalPenerimaan ? toDate(payload.tanggalPenerimaan) : undefined

  try {
    const record = await prisma.uniformRecord.update({
      where: { id },
      data: {
        ...payload,
        jumlah: payload.jumlah ? Number(payload.jumlah) : undefined,
        ...(tanggalPengajuan ? { tanggalPengajuan } : {}),
        ...(tanggalPenerimaan !== undefined ? { tanggalPenerimaan } : {}),
        ...(payload.status === 'Diterima' && !payload.tanggalPenerimaan ? { tanggalPenerimaan: new Date() } : {}),
        ...(payload.keterangan === null ? { keterangan: null } : {}),
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
