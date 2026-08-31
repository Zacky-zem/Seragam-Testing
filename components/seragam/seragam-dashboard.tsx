'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { LandingPage } from './landing-page'
import { LoginPage } from './login-page'
import { Navbar } from './navbar'
import { TrackingPage } from './tracking-page'
import type { UniformRecord, UserSession } from './types'

const normalizeRecord = (record: any): UniformRecord => ({
  id: record.id ?? record.noPR,
  namaKaryawan: record.namaKaryawan ?? 'Unknown',
  nik: record.nip ?? '',
  departemen: record.departemen ?? 'Unknown',
  section: record.section || (record.departemen && record.departemen !== 'Unknown' ? 'Belum diisi' : 'N/A'),
  jenisBaju: record.jenisSeragam ?? 'Tidak ada data',
  ukuran: record.ukuran ?? 'M',
  jumlahStel: Number(record.jumlah ?? 1),
  noPR: record.noPR ?? '',
  tglInput: record.tanggalPengajuan ? new Date(record.tanggalPengajuan).toISOString().split('T')[0] : '',
  tglTerima: record.tanggalPenerimaan ? new Date(record.tanggalPenerimaan).toISOString().split('T')[0] : null,
  keterangan: record.keterangan ?? undefined,
})

const toApiPayload = (record: UniformRecord) => ({
  noPR: record.noPR,
  namaKaryawan: record.namaKaryawan,
  nip: record.nik,
  departemen: record.departemen,
  section: record.section,
  ukuran: record.ukuran,
  jenisSeragam: record.jenisBaju,
  jumlah: record.jumlahStel,
  status: record.tglTerima ? 'Diterima' : 'Diajukan',
  tanggalPengajuan: record.tglInput || new Date().toISOString().split('T')[0],
  tanggalPenerimaan: record.tglTerima || null,
  keterangan: record.keterangan || null,
})

export default function SeragamDashboard() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [records, setRecords] = useState<UniformRecord[]>([])
  const [currentView, setCurrentView] = useState<'landing' | 'tracking'>('landing')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records')
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari server')
      }
      const data = await response.json()
      setRecords(Array.isArray(data) ? data.map(normalizeRecord) : [])
    } catch (error) {
      console.error(error)
      setRecords([])
      showToast('Gagal memuat data seragam dari database.', 'error')
    }
  }

  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchRecords()
    }
  }, [user?.isLoggedIn])

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Username atau password salah.')
      }

      setUser({
        username: data.user.username,
        fullName: data.user.name,
        role: 'admin',
        isLoggedIn: true,
      })
      setCurrentView('landing')
      showToast('Selamat datang kembali, Administrator GA!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Login gagal.', 'error')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
    } catch (error) {
      console.error(error)
    } finally {
      setUser(null)
      setCurrentView('landing')
      showToast('Anda telah berhasil logout dari sistem.', 'info')
    }
  }

  const handleAddRecord = async (newRecord: UniformRecord) => {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toApiPayload(newRecord)),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Gagal menyimpan data')
      }

      const saved = await response.json()
      setRecords((prev) => [normalizeRecord(saved), ...prev])
      showToast(`Pengajuan seragam untuk ${newRecord.namaKaryawan} (${newRecord.noPR}) berhasil disimpan.`, 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menyimpan data.', 'error')
    }
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      const response = await fetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus data')
      }

      setRecords((prev) => prev.filter((r) => r.id !== id))
      showToast('Data seragam berhasil dihapus.', 'info')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus data.', 'error')
    }
  }

  const handleUpdateRecord = async (updatedRecord: UniformRecord) => {
    try {
      const response = await fetch('/api/records', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...toApiPayload(updatedRecord),
          id: updatedRecord.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Gagal memperbarui data')
      }

      const saved = await response.json()
      setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? normalizeRecord(saved) : r)))
      showToast(`Data seragam ${updatedRecord.namaKaryawan} (${updatedRecord.noPR}) berhasil diperbarui.`, 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal memperbarui data.', 'error')
    }
  }

  if (!user || !user.isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar currentView={currentView} onNavigate={setCurrentView} user={user} onLogout={handleLogout} />

      <main className="flex-1 pb-16">
        {currentView === 'landing' ? (
          <LandingPage records={records} onNavigateToTracking={() => setCurrentView('tracking')} />
        ) : (
          <TrackingPage
            records={records}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <strong>PT Jatim Autocomp Indonesia (PT JAI)</strong> — Internal Uniform Tracking System
          </div>
          <div className="text-[11px] text-slate-400">Sistem Distribusi Seragam Berbasis Nomor PR</div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold shadow-lg ${
              toast.type === 'success'
                ? 'border-emerald-700 bg-emerald-900 text-emerald-100'
                : toast.type === 'error'
                  ? 'border-red-700 bg-red-900 text-red-100'
                  : 'border-blue-800 bg-[#143254] text-blue-100'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />}
            {toast.type === 'info' && <Info className="h-4 w-4 shrink-0 text-blue-400" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-white/60 transition-colors hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
