'use client'

import React, { useState } from 'react'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'

export function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> | void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) return setError('Username wajib diisi.')
    if (!password.trim()) return setError('Password wajib diisi.')
    setLoading(true)
    try { await onLogin(username, password) } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/5 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,hsl(var(--primary-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary-foreground))_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-card p-2 shadow-lg"><img src="/yazaki-logo.jpeg" alt="Yazaki" className="max-h-full max-w-full object-contain" /></div><span className="text-sm font-semibold tracking-wide">JAI Uniform</span></div>
          <div className="relative max-w-md animate-enter"><p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-accent">Uniform management system</p><h1 className="text-balance text-4xl font-bold leading-tight xl:text-5xl">Satu ruang untuk data seragam yang lebih terkendali.</h1><p className="mt-5 max-w-sm text-pretty leading-7 text-primary-foreground/70">Pantau pengajuan, ukuran, dan penerimaan seragam dengan alur kerja yang ringkas dan terstruktur.</p><div className="mt-10 flex gap-8 border-t border-primary-foreground/15 pt-5 text-sm"><div><strong className="block text-2xl">24/7</strong><span className="text-primary-foreground/60">Monitoring data</span></div><div><strong className="block text-2xl">100%</strong><span className="text-primary-foreground/60">Terkonsolidasi</span></div></div></div>
          <p className="relative text-xs text-primary-foreground/55">PT Jatim Autocomp Indonesia</p>
        </section>

        <section className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div className="flex items-center gap-3 lg:hidden"><div className="flex size-11 items-center justify-center rounded-xl border border-border bg-background p-2"><img src="/yazaki-logo.jpeg" alt="Yazaki" className="max-h-full max-w-full object-contain" /></div><div><p className="font-bold text-foreground">JAI Uniform</p><p className="text-xs text-muted-foreground">PT Jatim Autocomp Indonesia</p></div></div>
          <div className="mx-auto flex w-full max-w-md flex-col justify-center py-10 lg:py-0 animate-enter">
            <div className="mb-8"><p className="mb-3 text-sm font-semibold text-primary">Portal internal</p><h2 className="text-3xl font-bold tracking-tight text-foreground">Selamat datang kembali</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Masuk untuk mengelola distribusi data seragam.</p></div>
            {error && <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 text-xs font-medium text-destructive"><AlertCircle className="size-4 shrink-0" />{error}</div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-foreground" htmlFor="login-username">Username</label><div className="relative"><User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground" required /></div></div>
              <div className="flex flex-col gap-2"><label className="text-sm font-semibold text-foreground" htmlFor="login-password">Password</label><div className="relative"><Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground" required /><button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
              <button type="submit" id="btn-submit-login" disabled={loading} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"><span>{loading ? 'Memproses masuk...' : 'Masuk ke aplikasi'}</span>{!loading && <ArrowRight data-icon="inline-end" />}</button>
            </form>
            <div className="mt-6 rounded-xl border border-border bg-muted/50 px-4 py-3 text-center text-xs text-muted-foreground">Demo: <span className="font-semibold text-foreground">admin</span> / <span className="font-semibold text-foreground">admin123</span></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground lg:justify-start"><ShieldCheck className="size-4 text-primary" /><span>Akses terbatas untuk pengguna internal PT JAI</span></div>
        </section>
      </div>
    </main>
  )
}
