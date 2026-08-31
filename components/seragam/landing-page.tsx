'use client'

import React from 'react'
import { ArrowRight, Boxes, CheckCircle2, Clock, FileDown, FileSpreadsheet, LayoutDashboard, PackageCheck, Shirt } from 'lucide-react'
import type { UniformRecord } from './types'

export function LandingPage({ records, onNavigateToTracking }: { records: UniformRecord[]; onNavigateToTracking: () => void }) {
  const totalRecords = records.length
  const uniquePRs = new Set(records.map((r) => r.noPR)).size
  const pendingRecords = records.filter((r) => !r.tglTerima)
  const receivedRecords = records.filter((r) => !!r.tglTerima)
  const totalStel = records.reduce((acc, curr) => acc + (curr.jumlahStel || 1), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <div>
        <div className="text-xs font-bold tracking-wider uppercase text-blue-700 mb-1">SISTEM INTERNAL PT JAI</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Menu Utama & Dashboard Seragam</h2>
        <p className="text-sm text-slate-500 mt-1">Pantau pencatatan, pemesanan Nomor PR, dan distribusi seragam kerja secara terpusat.</p>
      </div>

      <div className="bg-[#143254] rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-blue-100 text-xs font-semibold">
              <Shirt className="w-4 h-4" />
              <span>PT JATIM AUTOCOMP INDONESIA</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Sistem Pelacakan Seragam Kerja</h3>
            <p className="text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Alur pemantauan distribusi seragam karyawan berbasis Nomor PR yang akurat, cepat, dan mudah digunakan.
            </p>
          </div>

          <div className="md:col-span-4 md:border-l md:border-white/15 md:pl-6 flex flex-row md:flex-col justify-between items-center md:items-start gap-3">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">{totalRecords}</div>
              <div className="text-xs text-blue-200 mt-0.5">Total Data Seragam Terdaftar</div>
            </div>
            <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{receivedRecords.length} Selesai Diterima</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard label="Total PR" value={uniquePRs} icon={<Boxes className="w-4 h-4" />} colors="bg-blue-50 text-blue-700" secondary="text-slate-900" subtitle="Nomor PR Aktif" />
        <KpiCard label="Dipesan" value={pendingRecords.length} icon={<Clock className="w-4 h-4" />} colors="bg-amber-50 text-amber-700" secondary="text-amber-600" subtitle="Menunggu Kedatangan" />
        <KpiCard label="Diterima" value={receivedRecords.length} icon={<CheckCircle2 className="w-4 h-4" />} colors="bg-emerald-50 text-emerald-700" secondary="text-emerald-600" subtitle="Sudah Diserahkan" />
        <KpiCard label="Total Stel" value={totalStel} icon={<PackageCheck className="w-4 h-4" />} colors="bg-indigo-50 text-indigo-700" secondary="text-slate-900" subtitle="Stel Seragam" />
      </div>

      <div className="space-y-3">
        <div className="text-sm font-bold text-slate-800">Akses Menu Utama</div>
        <div onClick={onNavigateToTracking} className="group bg-white hover:bg-slate-50/80 border-2 border-blue-600/30 hover:border-blue-600 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#143254] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8 text-blue-200" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Dashboard Tracking Data Seragam
              </h4>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                Buka tabel data seragam, form input pengajuan baru, upload Excel, dan kelola konfirmasi penerimaan seragam karyawan.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center">
            <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm bg-blue-700 text-white group-hover:bg-blue-800 shadow-sm group-hover:shadow transition-all">
              <span>Buka Data Seragam</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h5 className="text-sm font-bold text-slate-900">Download Format Template Excel</h5>
          <p className="text-xs text-slate-500 mt-0.5">Gunakan template resmi untuk input pengajuan baru atau update kedatangan seragam.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer">
            <FileDown className="w-4 h-4 text-blue-600" />
            <span>Template Pengajuan (.xlsx)</span>
          </button>
          <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Template Penerimaan (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, icon, colors, secondary, subtitle }: { label: string; value: number; icon: React.ReactNode; colors: string; secondary: string; subtitle: string }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-7 h-7 rounded-lg ${colors} flex items-center justify-center`}>{icon}</div>
      </div>
      <div className={`text-2xl sm:text-3xl font-extrabold ${secondary}`}>{value}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>
    </div>
  )
}
