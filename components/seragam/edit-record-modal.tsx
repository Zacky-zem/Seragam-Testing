'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { departments, sectionsMap, trouserSizes, uniformSizes } from '@/constants/uniform'
import type { UniformRecord } from '@/types/seragam'
import { parseFlexibleDate } from '@/lib/date-utils'

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

  const availableSections = sectionsMap[form.departemen] || []

  const handleDepartmentChange = (value: string) => {
    updateField('departemen', value === 'Lainnya' ? '' : value)
    updateField('section', '')
  }

  const handleSectionChange = (value: string) => {
    updateField('section', value === 'Lainnya' ? '' : value)
  }

  const handleShirtSizeChange = (value: string) => {
    updateField('ukuranBaju', value === 'Lainnya' ? '' : value)
  }

  const handleTrouserSizeChange = (value: string) => {
    updateField('ukuranCelana', value === 'Lainnya' ? '' : value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 sm:p-4 backdrop-blur-[1px] overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Edit Data Seragam Karyawan</h3>
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
            <input list="edit-department-options" value={form.departemen} onChange={(e) => handleDepartmentChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" placeholder="Pilih atau ketik departemen" />
            <datalist id="edit-department-options">{departments.map((dept) => <option key={dept} value={dept} />)}<option value="Lainnya" /></datalist>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Section</label>
            <input list="edit-section-options" value={form.section || ''} onChange={(e) => handleSectionChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" placeholder="Pilih atau ketik section" />
            <datalist id="edit-section-options">{availableSections.map((section) => <option key={section} value={section} />)}<option value="Lainnya" /></datalist>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Ukuran Baju</label>
            <input list="edit-shirt-size-options" value={form.ukuranBaju} onChange={(e) => handleShirtSizeChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" placeholder="Pilih atau ketik ukuran baju" />
            <datalist id="edit-shirt-size-options">{uniformSizes.filter((size) => size !== 'Custom Size').map((size) => <option key={size} value={size} />)}<option value="Lainnya" /></datalist>
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Ukuran Celana</label>
            <input list="edit-trouser-size-options" value={form.ukuranCelana || ''} onChange={(e) => handleTrouserSizeChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" placeholder="Pilih atau ketik ukuran celana" />
            <datalist id="edit-trouser-size-options">{trouserSizes.filter((size) => size !== 'Custom Size').map((size) => <option key={size} value={size} />)}<option value="Lainnya" /></datalist>
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

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Batch</label>
            <input value={form.batch || ''} onChange={(e) => updateField('batch', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm" />
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
