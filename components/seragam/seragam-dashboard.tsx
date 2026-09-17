'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useUniformRecords } from '@/hooks/use-uniform-records'
import type { AppPage, UniformRecord } from '@/types/seragam'
import { LandingPage } from './landing-page'
import { LoginPage } from './login-page'
import { Navbar } from './navbar'
import { TrackingPage } from './tracking-page'

type Toast = { message: string; type: 'success' | 'info' | 'error' }

const SessionLoading = () => <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">Memuat Halaman...</div>

export default function SeragamDashboard({ page }: { page: AppPage }) {
  const router = useRouter()
  const [toast, setToast] = useState<Toast | null>(null)
  const { isCheckingSession, login, logout, user } = useAuth(page)
  const showToast = (message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3000)
  }
  const { addRecord, deleteRecord, records, updateRecord } = useUniformRecords(Boolean(user?.isLoggedIn), (message) => showToast(message, 'error'))

  const requireLogin = () => {
    showToast('Silakan login terlebih dahulu untuk mengedit atau mengunduh data.', 'info')
    router.push('/login')
  }
  const handleAddRecord = async (record: UniformRecord) => {
    if (!user?.isLoggedIn) return requireLogin()
    if (await addRecord(record)) showToast(`Pengajuan seragam untuk ${record.namaKaryawan} (${record.noPR}) berhasil disimpan.`)
  }
  const handleUpdateRecord = async (record: UniformRecord) => {
    if (!user?.isLoggedIn) return requireLogin()
    if (await updateRecord(record)) showToast(`Data seragam ${record.namaKaryawan} (${record.noPR}) berhasil diperbarui.`)
  }
  const handleDeleteRecord = async (id: string) => {
    if (!user?.isLoggedIn) return requireLogin()
    if (await deleteRecord(id)) showToast('Data seragam berhasil dihapus.', 'error')
  }

  if (page === 'login') return isCheckingSession ? <SessionLoading /> : <LoginPage onLogin={login} />
  if (isCheckingSession) return <SessionLoading />

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <Navbar currentView={page} user={user} onLogout={logout} />
      <main className="flex-1 pb-16">
        {page === 'landing' ? (
          <LandingPage records={records} onNavigateToTracking={() => router.push('/seragam')} isLoggedIn={Boolean(user?.isLoggedIn)} onRequireLogin={() => router.push('/login')} />
        ) : (
          <TrackingPage records={records} onAddRecord={handleAddRecord} onUpdateRecord={handleUpdateRecord} onDeleteRecord={handleDeleteRecord} onNavigateHome={() => router.push('/landingpage')} />
        )}
      </main>
      <footer className="border-t border-border bg-card py-6 text-center text-xs text-muted-foreground no-print">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <div>© {new Date().getFullYear()} <strong>PT Jatim Autocomp Indonesia</strong></div>
          <div className="text-[11px] text-slate-400">Sistem Distribusi Seragam</div>
        </div>
      </footer>
      {toast && <ToastMessage toast={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

function ToastMessage({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info
  const color = toast.type === 'success' ? 'border-emerald-700 bg-emerald-900 text-emerald-100' : toast.type === 'error' ? 'border-red-700 bg-red-900 text-red-100' : 'border-blue-800 bg-[#143254] text-blue-100'
  return <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"><div className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold shadow-lg ${color}`}><Icon className="size-4 shrink-0" /><span>{toast.message}</span><button onClick={onClose} className="ml-2 text-white/60 transition-colors hover:text-white" aria-label="Tutup notifikasi"><X className="size-3.5" /></button></div></div>
}
