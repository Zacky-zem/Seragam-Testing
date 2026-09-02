'use client'

import React from 'react'
import * as XLSX from 'xlsx'
import { ArrowRight, CheckCircle2, FileDown, FileSpreadsheet, LayoutDashboard, Ruler, Shirt, Sparkles, Truck } from 'lucide-react'
import type { UniformRecord } from './types'

const SHIRT_CHART = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OPZFAIyIy2zr3MuMQzuc1rhDI1zaAy.png'
const TROUSER_CHART = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xYvbCQ1rfHJNGmV266QFERx1fGjcFv.png'

export function LandingPage({ records, onNavigateToTracking }: { records: UniformRecord[]; onNavigateToTracking: () => void }) {
  const pending = records.filter((record) => !record.tglTerima).length
  const received = records.filter((record) => Boolean(record.tglTerima)).length
  const totalStel = records.reduce((total, record) => total + (record.jumlahStel || 1), 0)

  const downloadTemplate = (kind: 'pengajuan' | 'penerimaan') => {
    const rows = kind === 'pengajuan'
      ? [{ noPR: '', namaKaryawan: '', NIK: '', departemen: '', section: '', jenisBaju: '', ukuran: '', ukuranCelana: '', jumlahStel: 1, tglInput: '', keterangan: '' }]
      : [{ noPR: '', tglTerima: '', keterangan: '' }]
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Template')
    XLSX.writeFile(book, `template-${kind}.xlsx`)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-xl">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent"><Sparkles data-icon="inline-start" /> PT. Jatim Autocomp Indonesia</div>
            <div className="flex flex-col gap-3">
              <h1 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">Data seragam lebih rapi, distribusi lebih terkendali.</h1>
              <p className="max-w-xl text-pretty leading-7 text-primary-foreground/75">Kelola pengajuan, ukuran baju dan celana, hingga penerimaan seragam karyawan PT Jatim Autocomp Indonesia dalam satu dashboard.</p>
            </div>
            <button onClick={onNavigateToTracking} className="inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"><span>Kelola Data Seragam</span><ArrowRight data-icon="inline-end" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Stat label="Total pengajuan" value={records.length} icon={<Shirt />} />
            <Stat label="Menunggu" value={pending} icon={<Truck />} />
            <Stat label="Sudah diterima" value={received} icon={<CheckCircle2 />} />
            <Stat label="Total stel" value={totalStel} icon={<Ruler />} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div><p className="text-sm font-semibold text-accent-foreground">Panduan ukuran</p><h2 className="text-2xl font-bold tracking-tight text-foreground">Pilih ukuran dengan lebih yakin</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Gunakan chart berikut sebagai referensi sebelum mengisi data ukuran baju dan celana.</p></div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartCard title="Ukuran Kemeja Kerja" description="Ukuran baju dalam centimeter" src={SHIRT_CHART} />
          <ChartCard title="Ukuran Celana Kerja" description="Ukuran celana dalam centimeter" src={TROUSER_CHART} />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><h2 className="font-bold text-card-foreground">Template Excel</h2><p className="mt-1 text-sm text-muted-foreground">Gunakan format ini untuk input data secara massal.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={() => downloadTemplate('pengajuan')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"><FileDown data-icon="inline-start" /> Template Pengajuan</button><button onClick={() => downloadTemplate('penerimaan')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"><FileSpreadsheet data-icon="inline-start" /> Template Penerimaan</button></div>
      </section>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-4"><div className="mb-5 flex items-center justify-between text-primary-foreground/65"><span className="text-xs font-medium">{label}</span><span className="text-accent">{icon}</span></div><strong className="text-3xl">{value}</strong></div>
}

function ChartCard({ title, description, src }: { title: string; description: string; src: string }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="flex items-center gap-3 border-b border-border p-4"><div className="rounded-xl bg-muted p-2 text-accent-foreground"><Ruler /></div><div><h3 className="font-bold text-card-foreground">{title}</h3><p className="text-xs text-muted-foreground">{description}</p></div></div><div className="bg-muted/30 p-3"><img src={src} alt={`Panduan ${title}`} className="h-auto max-h-[34rem] w-full rounded-xl object-contain" /></div></article>
}
