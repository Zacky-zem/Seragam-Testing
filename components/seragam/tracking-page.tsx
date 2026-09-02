'use client'

import React, { useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  FileSpreadsheet,
  PackageCheck,
  Search,
  Trash2,
  Upload,
  X,
  Download,
  Minimize2,
  ChevronDown,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { departments, sectionsMap, trouserSizes, uniformSizes, uniformTypes } from './data'
import type { UniformRecord } from './types'
import { EditRecordModal } from './edit-record-modal'

const generateNoPR = () => {
  const year = new Date().getFullYear()
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `PR-${year}-JAI-${randomPart}`
}

export function TrackingPage({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onNavigateHome,
}: {
  records: UniformRecord[]
  onAddRecord: (newRecord: UniformRecord) => void
  onUpdateRecord: (updatedRecord: UniformRecord) => void
  onDeleteRecord: (id: string) => void
  onNavigateHome: () => void
}) {
  const [namaKaryawan, setNamaKaryawan] = useState('')
  const [nik, setNik] = useState('')
  const [deptOption, setDeptOption] = useState<string>(departments[0])
  const [customDept, setCustomDept] = useState('')
  const [sectionOption, setSectionOption] = useState<string>(sectionsMap[departments[0]][0])
  const [customSection, setCustomSection] = useState('')
  const [jenisBaju, setJenisBaju] = useState(uniformTypes[0])
  const [ukuran, setUkuran] = useState(uniformSizes[4])
  const [ukuranCelana, setUkuranCelana] = useState(trouserSizes[3])
  const [jumlahStel, setJumlahStel] = useState(1)
  const [noPR, setNoPR] = useState(generateNoPR())
  const [tglInput, setTglInput] = useState(new Date().toISOString().split('T')[0])
  const [tglTerima, setTglTerima] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'dipesan' | 'diterima'>('all')
  const [selectedPR, setSelectedPR] = useState('ALL')
  const [startDateInput, setStartDateInput] = useState('')
  const [endDateInput, setEndDateInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingRecord, setEditingRecord] = useState<UniformRecord | null>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterSection, setFilterSection] = useState('ALL')
  const [filterJenisBaju, setFilterJenisBaju] = useState('ALL')
  const [filterUkuran, setFilterUkuran] = useState('ALL')
  const [filterNik, setFilterNik] = useState('')
  const [filterNama, setFilterNama] = useState('')

  const uniquePRList = useMemo(() => Array.from(new Set(records.map((r) => r.noPR))).filter(Boolean).sort(), [records])
  const uniqueDeptFilterList = useMemo(() => Array.from(new Set([...departments, ...records.map((r) => r.departemen)])).filter(Boolean), [records])

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.namaKaryawan.toLowerCase().includes(q)
        const matchNik = item.nik.toLowerCase().includes(q)
        const matchPR = item.noPR.toLowerCase().includes(q)
        const matchDept = item.departemen.toLowerCase().includes(q)
        const matchSection = (item.section || '').toLowerCase().includes(q)
        if (!matchName && !matchNik && !matchPR && !matchDept && !matchSection) return false
      }
      if (filterNama.trim() && !item.namaKaryawan.toLowerCase().includes(filterNama.toLowerCase().trim())) return false
      if (filterNik.trim() && !item.nik.toLowerCase().includes(filterNik.toLowerCase().trim())) return false
      if (selectedDept !== 'ALL' && item.departemen !== selectedDept) return false
      if (selectedPR !== 'ALL' && item.noPR !== selectedPR) return false
      if (filterSection !== 'ALL' && item.section !== filterSection) return false
      if (filterJenisBaju !== 'ALL' && item.jenisBaju !== filterJenisBaju) return false
      if (filterUkuran !== 'ALL' && item.ukuran !== filterUkuran) return false
      if (selectedStatus === 'dipesan' && item.tglTerima) return false
      if (selectedStatus === 'diterima' && !item.tglTerima) return false
      if (startDateInput && item.tglInput < startDateInput) return false
      if (endDateInput && item.tglInput > endDateInput) return false
      return true
    })
  }, [records, searchQuery, filterNama, filterNik, selectedDept, selectedStatus, selectedPR, filterSection, filterJenisBaju, filterUkuran, startDateInput, endDateInput])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage))
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredRecords.slice(start, start + itemsPerPage)
  }, [filteredRecords, currentPage, itemsPerPage])

  const handleDeptChange = (dept: string) => {
    setDeptOption(dept)
    if (dept === '__MANUAL__') {
      setSectionOption('__MANUAL__')
      return
    }
    const secs = sectionsMap[dept] || []
    setSectionOption(secs.length ? secs[0] : '__MANUAL__')
  }

  const handleResetForm = () => {
    setNamaKaryawan('')
    setNik('')
    setDeptOption(departments[0])
    setCustomDept('')
    setSectionOption(sectionsMap[departments[0]][0])
    setCustomSection('')
    setJenisBaju(uniformTypes[0])
    setUkuran(uniformSizes[4])
    setUkuranCelana(trouserSizes[3])
    setJumlahStel(1)
    setNoPR(generateNoPR())
    setTglInput(new Date().toISOString().split('T')[0])
    setTglTerima('')
    setKeterangan('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!namaKaryawan.trim() || !nik.trim() || !noPR.trim()) {
      alert('Nama Karyawan, NIK, dan Nomor PR wajib diisi.')
      return
    }

    const resolvedDept = deptOption === '__MANUAL__' ? customDept.trim() : deptOption
    const resolvedSection = sectionOption === '__MANUAL__' ? customSection.trim() : sectionOption

    if (!resolvedDept || !resolvedSection) {
      alert('Departemen dan section wajib diisi.')
      return
    }

    const newRecord: UniformRecord = {
      id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      namaKaryawan: namaKaryawan.trim(),
      nik: nik.trim().toUpperCase(),
      departemen: resolvedDept,
      section: resolvedSection,
      jenisBaju,
      ukuran,
      ukuranCelana,
      jumlahStel: Number(jumlahStel) || 1,
      noPR: noPR.trim().toUpperCase(),
      tglInput: tglInput || new Date().toISOString().split('T')[0],
      tglTerima: tglTerima || null,
      keterangan: keterangan.trim() || undefined,
    }

    onAddRecord(newRecord)
    handleResetForm()
  }

  const toggleRecordSelection = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectVisible = () => {
    const visibleIds = paginatedRecords.map((record) => record.id)
    const allSelected = visibleIds.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) => {
      if (allSelected) {
        return prev.filter((id) => !visibleIds.includes(id))
      }
      return Array.from(new Set([...prev, ...visibleIds]))
    })
  }

  const markSelectedAsReceived = () => {
    const today = new Date().toISOString().split('T')[0]
    records.forEach((record) => {
      if (selectedIds.includes(record.id) && !record.tglTerima) {
        onUpdateRecord({ ...record, tglTerima: today })
      }
    })
    setSelectedIds([])
  }

  const deleteSelected = () => {
    selectedIds.forEach((id) => onDeleteRecord(id))
    setSelectedIds([])
  }

  const handleQuickMarkReceived = (record: UniformRecord) => {
    const today = new Date().toISOString().split('T')[0]
    onUpdateRecord({ ...record, tglTerima: today })
  }

  const uniqueSectionList = useMemo(() => Array.from(new Set(records.map((r) => r.section).filter(Boolean))).sort(), [records])
  const uniqueJenisList = useMemo(() => Array.from(new Set(records.map((r) => r.jenisBaju).filter(Boolean))).sort(), [records])
  const uniqueUkuranList = useMemo(() => Array.from(new Set(records.map((r) => r.ukuran).filter(Boolean))).sort(), [records])
  const hasActiveFilters = searchQuery || filterNama || filterNik || selectedDept !== 'ALL' || selectedStatus !== 'all' || selectedPR !== 'ALL' || filterSection !== 'ALL' || filterJenisBaju !== 'ALL' || filterUkuran !== 'ALL' || startDateInput || endDateInput

  const resetFilters = () => {
    setSearchQuery('')
    setFilterNama('')
    setFilterNik('')
    setSelectedDept('ALL')
    setSelectedStatus('all')
    setSelectedPR('ALL')
    setFilterSection('ALL')
    setFilterJenisBaju('ALL')
    setFilterUkuran('ALL')
    setStartDateInput('')
    setEndDateInput('')
    setCurrentPage(1)
  }

  const formatDate = (value: string | null) => {
    if (!value) return '-'
    return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const downloadTemplate = (kind: 'pengajuan' | 'penerimaan') => {
    const rows = kind === 'pengajuan'
      ? [{ noPR: '', namaKaryawan: '', NIK: '', departemen: '', section: '', jenisBaju: '', ukuran: '', ukuranCelana: '', jumlahStel: 1, tglInput: '', keterangan: '' }]
      : [{ noPR: '', tglTerima: '', keterangan: '' }]
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Template')
    XLSX.writeFile(book, `template-${kind}.xlsx`)
  }

  const exportExcel = (useFilter = true) => {
    const sourceRecords = useFilter ? filteredRecords : records
    const rows = sourceRecords.map((record) => ({
      'No. PR': record.noPR, NIK: record.nik, 'Nama Karyawan': record.namaKaryawan,
      Departemen: record.departemen, Section: record.section, 'Jenis Baju': record.jenisBaju,
      'Ukuran Baju': record.ukuran, 'Uk. Celana': record.ukuranCelana, Jumlah: record.jumlahStel, 'Tgl Input': record.tglInput,
      'Tgl Terima': record.tglTerima || '', Status: record.tglTerima ? 'Diterima' : 'Dipesan', Keterangan: record.keterangan || '',
    }))
    const sheet = XLSX.utils.json_to_sheet(rows)
    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, 'Data Seragam')
    XLSX.writeFile(book, `${useFilter ? 'hasil-filter-seragam' : 'semua-data-seragam'}-${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  const importPengajuan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]])
    rows.forEach((row) => {
      if (row.noPR && row.namaKaryawan) onAddRecord({ id: `import-${Date.now()}-${Math.random()}`, namaKaryawan: String(row.namaKaryawan), nik: String(row.NIK ?? row.nik ?? ''), departemen: String(row.departemen ?? ''), section: String(row.section ?? ''), jenisBaju: String(row.jenisBaju ?? row.jenisSeragam ?? uniformTypes[0]), ukuran: String(row.ukuran ?? uniformSizes[4]), ukuranCelana: String(row.ukuranCelana ?? row['Uk. Celana'] ?? trouserSizes[3]), jumlahStel: Number(row.jumlahStel ?? row.jumlah ?? 1), noPR: String(row.noPR), tglInput: String(row.tglInput ?? ''), tglTerima: null, keterangan: String(row.keterangan ?? '') })
    })
    event.target.value = ''
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <button onClick={onNavigateHome} id="btn-back-to-home" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2 cursor-pointer">
          <span className="text-sm">←</span>
          <span>Kembali ke menu utama</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Seragam</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input ref={uploadInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={importPengajuan} className="hidden" />
            <button onClick={() => uploadInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-xl border border-accent bg-background px-3.5 py-2 text-xs font-semibold text-accent-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-accent/20">
              <Upload className="h-3.5 w-3.5 text-amber-600" />
              <span>Upload Pengajuan</span>
            </button>
            <button onClick={markSelectedAsReceived} disabled={selectedIds.length === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-background px-3.5 py-2 text-xs font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50">
              <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Update Penerimaan</span>
            </button>
            <button onClick={() => exportExcel(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Unduh Hasil Filter</span>
            </button>
            <button onClick={() => exportExcel(false)} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted">
              <Download className="h-3.5 w-3.5" />
              <span>Unduh Semua</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" aria-label={isFormOpen ? 'Minimize form' : 'Tampilkan form'} title={isFormOpen ? 'Minimize form' : 'Tampilkan form'} onClick={() => setIsFormOpen((v) => !v)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-slate-600 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900">
              <Minimize2 className={`h-3.5 w-3.5 transition-transform ${isFormOpen ? '' : 'rotate-180'}`} />
              <span className="sr-only">{isFormOpen ? 'Sembunyikan Form' : 'Tampilkan Form'}</span>
            </button>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Nama Karyawan</label>
              <input value={namaKaryawan} onChange={(e) => setNamaKaryawan(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Nama lengkap" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">NIK</label>
              <input value={nik} onChange={(e) => setNik(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="JAI-xxxx" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Nomor PR</label>
              <input value={noPR} onChange={(e) => setNoPR(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="PR-2024-JAI-120" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Departemen</label>
              <select value={deptOption} onChange={(e) => handleDeptChange(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="__MANUAL__">Manual input...</option>
              </select>
            </div>
            {deptOption === '__MANUAL__' && (
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Custom Departemen</label>
                <input value={customDept} onChange={(e) => setCustomDept(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Masukkan departemen" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Section</label>
              <select value={sectionOption} onChange={(e) => setSectionOption(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {((deptOption === '__MANUAL__' ? ['Manual'] : sectionsMap[deptOption] || [])).map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
                {deptOption !== '__MANUAL__' && <option value="__MANUAL__">Manual input...</option>}
              </select>
            </div>
            {sectionOption === '__MANUAL__' && (
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Custom Section</label>
                <input value={customSection} onChange={(e) => setCustomSection(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Masukkan section" />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Jenis Baju</label>
              <select value={jenisBaju} onChange={(e) => setJenisBaju(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {uniformTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Ukuran</label>
              <select value={ukuran} onChange={(e) => setUkuran(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {uniformSizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Uk. Celana</label>
              <select value={ukuranCelana} onChange={(e) => setUkuranCelana(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                {trouserSizes.map((size) => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Jumlah Stel</label>
              <input type="number" min={1} value={jumlahStel} onChange={(e) => setJumlahStel(Number(e.target.value || 1))} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tgl Input</label>
              <input type="date" value={tglInput} onChange={(e) => setTglInput(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Terima</label>
              <input type="date" value={tglTerima} onChange={(e) => setTglTerima(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Keterangan</label>
              <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={2} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" placeholder="Catatan tambahan..." />
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 flex justify-end gap-2">
              <button type="button" onClick={handleResetForm} className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Reset</button>
              <button type="submit" className="rounded-xl bg-[#143254] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1d4470]">Simpan Data</button>
            </div>
          </form>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari nama, NIK, PR, departemen, section..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" />
          </div>
          <div className="relative flex items-center gap-2">
            <button type="button" onClick={() => setIsFilterOpen((value) => !value)} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${hasActiveFilters ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-border bg-background text-slate-700'}`}><Filter className="h-3.5 w-3.5" /> Filter {hasActiveFilters ? '(aktif)' : ''}</button>
            {isFilterOpen && <div className="absolute right-0 top-11 z-30 grid w-[min(92vw,680px)] gap-3 rounded-2xl border border-border bg-background p-4 text-xs shadow-xl sm:grid-cols-2 lg:grid-cols-3">
              <label className="grid gap-1 font-semibold">Nama<input value={filterNama} onChange={(e) => setFilterNama(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal" placeholder="Cari nama" /></label>
              <label className="grid gap-1 font-semibold">NIK<input value={filterNik} onChange={(e) => setFilterNik(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal" placeholder="Cari NIK" /></label>
              {([['Departemen', selectedDept, setSelectedDept, uniqueDeptFilterList], ['Nomor PR', selectedPR, setSelectedPR, uniquePRList], ['Section', filterSection, setFilterSection, uniqueSectionList], ['Jenis Baju', filterJenisBaju, setFilterJenisBaju, uniqueJenisList], ['Ukuran', filterUkuran, setFilterUkuran, uniqueUkuranList]] as const).map(([label, value, setter, options]) => <label key={label} className="grid gap-1 font-semibold">{label}<select value={value} onChange={(e) => setter(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal"><option value="ALL">Semua</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>)}
              <label className="grid gap-1 font-semibold">Status<select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal"><option value="all">Semua</option><option value="dipesan">Dipesan</option><option value="diterima">Diterima</option></select></label>
              <label className="grid gap-1 font-semibold">Tanggal mulai<input type="date" value={startDateInput} onChange={(e) => setStartDateInput(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal" /></label>
              <label className="grid gap-1 font-semibold">Tanggal akhir<input type="date" value={endDateInput} onChange={(e) => setEndDateInput(e.target.value)} className="rounded-lg border border-slate-200 px-2.5 py-2 font-normal" /></label>
              <div className="flex items-end justify-end gap-2 sm:col-span-2 lg:col-span-3"><button type="button" onClick={resetFilters} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold">Reset</button><button type="button" onClick={() => setIsFilterOpen(false)} className="rounded-lg bg-[#143254] px-3 py-2 font-semibold text-white">Terapkan</button></div>
            </div>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1400px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-10 px-3 py-3 text-center">
                  <input type="checkbox" checked={paginatedRecords.length > 0 && paginatedRecords.every((record) => selectedIds.includes(record.id))} onChange={toggleSelectVisible} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                </th>
                <th className="px-4 py-3 font-semibold">No. PR</th>
                <th className="px-4 py-3 font-semibold">NIK</th>
                <th className="px-4 py-3 font-semibold">Nama Karyawan</th>
                <th className="px-4 py-3 font-semibold">Departemen &amp; Section</th>
                <th className="px-4 py-3 font-semibold">Jenis Baju</th>
                <th className="px-4 py-3 font-semibold">Uk. Baju</th>
                <th className="px-4 py-3 font-semibold">Uk. Celana</th>
                <th className="px-4 py-3 font-semibold">Jumlah</th>
                <th className="px-4 py-3 font-semibold">Tgl Input</th>
                <th className="px-4 py-3 font-semibold">Tgl Terima</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Keterangan</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.id} className={`border-t border-slate-200 hover:bg-slate-50/80 ${selectedIds.includes(record.id) ? 'bg-blue-50/40' : ''}`}>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" checked={selectedIds.includes(record.id)} onChange={() => toggleRecordSelection(record.id)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
                  </td>
                  <td className="px-4 py-3 font-semibold text-blue-700">{record.noPR}</td>
                  <td className="px-4 py-3 text-slate-700">{record.nik}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{record.namaKaryawan}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <div>{record.departemen}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{record.section || 'Belum diisi'}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{record.jenisBaju}</td>
                  <td className="px-4 py-3"><span className="inline-flex rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">{record.ukuran}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{record.ukuranCelana || '-'}</span></td>
                  <td className="px-4 py-3 text-slate-700">{record.jumlahStel} stel</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(record.tglInput)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(record.tglTerima)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${record.tglTerima ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                      {record.tglTerima ? 'Selesai' : 'Dipesan'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{record.keterangan || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!record.tglTerima && (
                        <button onClick={() => handleQuickMarkReceived(record)} className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100">
                          <CheckSquare className="h-3.5 w-3.5" />
                          Terima
                        </button>
                      )}
                      <button onClick={() => setEditingRecord(record)} className="inline-flex items-center justify-center rounded-md border border-border bg-background p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900" title="Edit data">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></svg>
                      </button>
                      <button onClick={() => onDeleteRecord(record.id)} className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100" title="Hapus data">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/70 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={paginatedRecords.length > 0 && paginatedRecords.every((record) => selectedIds.includes(record.id))} onChange={toggleSelectVisible} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />
              <span>{selectedIds.length} data terpilih</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={markSelectedAsReceived} disabled={selectedIds.length === 0} className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Tandai Diterima Hari Ini
              </button>
              <button onClick={deleteSelected} disabled={selectedIds.length === 0} className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Hapus Terpilih
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
          <div className="text-xs text-slate-500">Menampilkan {filteredRecords.length} data</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="text-xs font-medium text-slate-700">Page {currentPage} / {totalPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-40">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {editingRecord && (
        <EditRecordModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={(updated) => {
            onUpdateRecord(updated)
            setEditingRecord(null)
          }}
          onDelete={() => {
            onDeleteRecord(editingRecord.id)
            setEditingRecord(null)
          }}
        />
      )}
    </div>
  )
}
