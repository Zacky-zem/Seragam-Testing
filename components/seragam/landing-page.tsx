'use client'

import Image from 'next/image'
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
      ? [{ noPR: '', namaKaryawan: '', NIK: '', departemen: '', section: '', ukuranBaju: '', ukuranCelana: '', jumlahStel: 1, tglInput: '', keterangan: '' }]
      : [{ noPR: '', tglTerima: '', keterangan: '' }]
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Template')
    XLSX.writeFile(book, `template-${kind}.xlsx`)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] bg-primary text-primary-foreground shadow-xl">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div className="flex flex-col gap-6 py-5 sm:gap-7 sm:py-8 lg:py-10">
            <div className="relative -top-4 flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary-foreground/90 sm:-top-6 lg:-top-8"><Sparkles aria-hidden="true" /> <span>PT. JATIM AUTOCOMP INDONESIA</span></div>
            <div className="animate-fade-up flex flex-col gap-6 sm:gap-7">
              <div className="flex flex-col gap-4">
                <h1 className="max-w-2xl text-balance text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">Data seragam lebih rapi, distribusi lebih terkendali.</h1>
                <p className="max-w-xl text-pretty text-base font-normal leading-7 text-slate-200 sm:text-lg">Kelola seluruh proses pengajuan seragam karyawan, dari ukuran hingga penerimaan, secara efisien dalam satu dasbor terpadu.</p>
              </div>
              <button onClick={onNavigateToTracking} className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-lg shadow-slate-950/15 transition-all hover:-translate-y-1 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"><span>Kelola Data Seragam</span><ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <div className="animate-fade-up animate-delay-2 relative flex min-h-72 items-center justify-center overflow-hidden p-2 sm:min-h-80 lg:min-h-[22rem]">
            <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
              <div className="absolute right-0 top-8 h-px w-3/4 rotate-[-12deg] bg-cyan-200/70" />
              <div className="absolute right-8 top-24 h-px w-2/3 rotate-[18deg] bg-cyan-200/50" />
              <div className="absolute bottom-24 right-0 h-px w-3/4 rotate-[-8deg] bg-cyan-200/40" />
              <div className="absolute right-1/4 top-1/4 h-40 w-40 rounded-full border border-cyan-200/30" />
              <div className="absolute bottom-4 right-10 h-52 w-52 rounded-full border border-cyan-200/20" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-[-18%] w-[125%] bg-gradient-to-l from-transparent via-primary/15 to-primary/90" aria-hidden="true" />
            <div className="relative flex flex-col items-center justify-center gap-4 text-center transition-transform duration-700 hover:scale-105">
              <Image src="/yazaki-logo.jpeg" alt="Logo Yazaki" width={860} height={344} className="h-auto w-[min(135%,48rem)] object-contain brightness-0 invert opacity-95 drop-shadow-[0_18px_28px_rgba(0,0,0,0.3)] sm:w-[min(125%,52rem)]" />
              <p className="text-sm font-medium tracking-wide text-slate-300">PT. Jatim Autocomp Indonesia</p>
            </div>
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

function ChartCard({ title, description, src }: { title: string; description: string; src: string }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><div className="flex items-center gap-3 border-b border-border p-4"><div className="rounded-xl bg-muted p-2 text-accent-foreground"><Ruler /></div><div><h3 className="font-bold text-card-foreground">{title}</h3><p className="text-xs text-muted-foreground">{description}</p></div></div><div className="bg-muted/30 p-3"><img src={src} alt={`Panduan ${title}`} className="h-auto max-h-[34rem] w-full rounded-xl object-contain" /></div></article>
}
