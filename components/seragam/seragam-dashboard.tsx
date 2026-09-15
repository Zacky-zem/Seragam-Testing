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
const SessionLoading = () => <div className="grid min-h-screen place-items-center bg-[#071d38] text-sm text-white/70">Memuat dashboard...</div>

export default function SeragamDashboard({ page }: { page: AppPage }) {
  const router = useRouter(); const [toast, setToast] = useState<Toast | null>(null); const { isCheckingSession, login, logout, user } = useAuth(page)
  const [loginGateOpen, setLoginGateOpen] = useState(false); const showToast = (message: string, type: Toast['type'] = 'success') => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3000) }
  const { addRecord, deleteRecord, records, updateRecord } = useUniformRecords(true, (message) => showToast(message, 'error'))
  const requireAuth = (action?: () => void) => { if (user?.isLoggedIn) action?.(); else setLoginGateOpen(true) }
  if (page === 'login') return isCheckingSession ? <SessionLoading /> : <LoginPage onLogin={login} />
  if (isCheckingSession) return <SessionLoading />
  const onAdd = (record: UniformRecord) => requireAuth(async () => { if (await addRecord(record)) showToast(`Pengajuan ${record.namaKaryawan} berhasil disimpan.`) })
  const onUpdate = (record: UniformRecord) => requireAuth(async () => { if (await updateRecord(record)) showToast(`Data ${record.namaKaryawan} berhasil diperbarui.`) })
  const onDelete = (id: string) => requireAuth(async () => { if (await deleteRecord(id)) showToast('Data seragam berhasil dihapus.', 'error') })
  return <div className="min-h-screen bg-[#f4f8fc] text-foreground"><Navbar currentView={page} user={user} onLogout={logout} onLogin={() => setLoginGateOpen(true)} /><main className="flex-1 pb-16 pt-24">{page === 'landing' ? <LandingPage records={records} onNavigateToTracking={() => router.push('/seragam')} onRequireAuth={() => setLoginGateOpen(true)} /> : <TrackingPage records={records} onAddRecord={onAdd} onUpdateRecord={onUpdate} onDeleteRecord={onDelete} onRequireAuth={() => setLoginGateOpen(true)} onNavigateHome={() => router.push('/landingpage')} />}</main><footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">© {new Date().getFullYear()} PT Jatim Autocomp Indonesia · Sistem Distribusi Seragam</footer>{toast && <ToastMessage toast={toast} onClose={() => setToast(null)} />}{loginGateOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#031326]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true"><div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white/90 p-7 shadow-2xl"><div className="mb-5 flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Akses terbatas</p><h2 className="mt-2 text-2xl font-bold text-[#082343]">Masuk untuk melanjutkan</h2></div><button onClick={() => setLoginGateOpen(false)} aria-label="Tutup" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="size-4" /></button></div><p className="mb-6 text-sm leading-6 text-slate-600">Anda tetap dapat melihat data tanpa login. Silakan masuk untuk menambah, mengubah, menghapus, mengimpor, atau mengunduh data.</p><button onClick={() => router.push('/login')} className="w-full rounded-xl bg-[#082343] px-4 py-3 text-sm font-bold text-white hover:bg-[#0d3b68]">Buka halaman login</button></div></div>}</div>
}
function ToastMessage({ toast, onClose }: { toast: Toast; onClose: () => void }) { const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? AlertCircle : Info; return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-[#123c68] bg-[#082343] p-4 text-xs font-semibold text-white shadow-xl"><Icon className="size-4" /><span>{toast.message}</span><button onClick={onClose} aria-label="Tutup notifikasi"><X className="size-4" /></button></div> }
