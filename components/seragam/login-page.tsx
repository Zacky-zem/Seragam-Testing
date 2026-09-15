'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'

export function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> | void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('')
    if (!username.trim() || !password.trim()) { setError('Username dan password wajib diisi.'); return }
    setLoading(true)
    try { await onLogin(username, password) } catch (reason) { setError(reason instanceof Error ? reason.message : 'Login gagal. Silakan coba lagi.') } finally { setLoading(false) }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#071d38] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(3,21,46,.9),rgba(5,61,116,.35)),url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3y2a9UrNIJdzfJFLXmRVMnCs8yVEj1.png')] bg-cover bg-center" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(86,189,255,.35),transparent_30%),linear-gradient(180deg,transparent_20%,rgba(2,15,33,.8))]" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-between px-2">
          <Link href="/landingpage" className="text-sm font-semibold text-white/80 transition hover:text-white">← Lihat dashboard</Link>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-[.18em] text-white/75"><span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" /> JAI UNIFORM</div>
        </div>
        <section className="rounded-[2rem] border border-white/30 bg-white/14 p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-9">
          <div className="mb-8"><div className="mb-4 inline-flex rounded-2xl border border-white/20 bg-white/12 p-3"><LockKeyhole className="size-5 text-cyan-200" /></div><h1 className="text-3xl font-bold tracking-tight">Selamat datang kembali</h1><p className="mt-2 text-sm leading-6 text-white/70">Masuk untuk mengelola data seragam dengan aman.</p></div>
          {error && <div role="alert" className="mb-5 flex gap-2 rounded-xl border border-red-200/30 bg-red-400/15 p-3 text-sm text-red-100"><AlertCircle className="size-4 shrink-0" />{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2 text-sm font-medium text-white/85">Username<div className="relative"><UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/50" /><input id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-xl border border-white/25 bg-black/15 px-11 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/25" placeholder="Masukkan username" /></div></label>
            <label className="flex flex-col gap-2 text-sm font-medium text-white/85">Password<div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/50" /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/25 bg-black/15 px-11 py-3 pr-12 text-white outline-none transition placeholder:text-white/40 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/25" placeholder="Masukkan password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/60 hover:text-white" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>
            <button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-bold text-[#082343] shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50 disabled:cursor-wait disabled:opacity-70">{loading ? 'Memproses...' : 'Masuk ke aplikasi'} {!loading && <ArrowRight className="size-4" />}</button>
          </form>
          <div className="mt-7 flex items-center gap-2 border-t border-white/15 pt-5 text-xs text-white/55"><ShieldCheck className="size-4 text-cyan-200" /> Hanya pengguna terautorisasi yang dapat mengubah data.</div>
        </section>
      </div>
    </main>
  )
}
