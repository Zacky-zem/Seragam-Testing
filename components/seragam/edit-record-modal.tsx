'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { departments, sectionsMap, trouserSizes, uniformSizes } from './data'
import type { UniformRecord } from './types'

export function EditRecordModal({
  record,
  onClose,
  onSave,
  onDelete,
}: {
  record: UniformRecord
  onClose: () => void
  onSave: (updatedRecord: UniformRecord) => void
  onDelete: () => void
}) {
  const [form, setForm] = useState<UniformRecord>(record)

  useEffect(() => {
    setForm(record)
  }, [record])

  const updateField = <K extends keyof UniformRecord>(key: K, value: UniformRecord[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4 backdrop-blur-[1px] overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.18em] text-blue-700 uppercase">Edit Data</div>
            <h3 className="text-xl font-extrabold text-slate-900">Edit Seragam Karyawan</h3>
          </div>
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Close modal">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 overflow-y-auto">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Nama Karyawan</label>
            <input value={form.namaKaryawan} onChange={(e) => updateField('namaKaryawan', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">NIK</label>
            <input value={form.nik} onChange={(e) => updateField('nik', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Nomor PR</label>
            <input value={form.noPR} onChange={(e) => updateField('noPR', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Departemen</label>
            <select value={form.departemen} onChange={(e) => updateField('departemen', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Section</label>
            <select value={form.section || ''} onChange={(e) => updateField('section', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              {Array.from(new Set([...(sectionsMap[form.departemen] || []), form.section].filter(Boolean))).map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
              <option value="">Belum diisi</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Ukuran Baju</label>
            <select value={form.ukuranBaju} onChange={(e) => updateField('ukuranBaju', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              {uniformSizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Ukuran Celana</label>
            <select value={form.ukuranCelana || ''} onChange={(e) => updateField('ukuranCelana', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <option value="">Belum diisi</option>
              {trouserSizes.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Jumlah Stel</label>
            <input type="number" min={1} value={form.jumlahStel} onChange={(e) => updateField('jumlahStel', Number(e.target.value || 1))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Input</label>
            <input type="date" value={form.tglInput} onChange={(e) => updateField('tglInput', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Terima</label>
            <input type="date" value={form.tglTerima || ''} onChange={(e) => updateField('tglTerima', e.target.value || null)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Keterangan</label>
            <textarea value={form.keterangan || ''} onChange={(e) => updateField('keterangan', e.target.value || undefined)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={onDelete} className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Hapus Data</button>
          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Batal</button>
            <button onClick={() => onSave(form)} className="rounded-xl bg-[#143254] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4470]">Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </div>
  )
}
