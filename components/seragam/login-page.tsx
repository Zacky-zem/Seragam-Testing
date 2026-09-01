'use client'

import React, { useState } from 'react'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, ShieldCheck, User } from 'lucide-react'

const YAZAKI_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yazaki-logo.jpeg-xFEuC9ZS4EWukVkz3Ltk8t973SzHLw.png'

export function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> | void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username.trim()) return setError('Username wajib diisi.')
    if (!password.trim()) return setError('Password wajib diisi.')
    setLoading(true)
    try { await onLogin(username, password) } catch { setError('Login gagal. Periksa kembali akun Anda.') } finally { setLoading(false) }
  }

  return (
    <main className="login-shell min-h-screen w-full bg-background lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)]">
      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16 xl:px-24">
        <header className="animate-rise flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15"><span className="text-lg font-bold">DS</span></div>
          <div><p className="text-lg font-bold tracking-tight text-foreground">Data Seragam</p><p className="text-xs font-medium text-muted-foreground">PT Jatim Autocomp Indonesia</p></div>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="animate-rise mb-8 [animation-delay:100ms]"><p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent-foreground">Internal workspace</p><h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Selamat datang.</h1><p className="mt-3 max-w-sm text-pretty text-sm leading-6 text-muted-foreground">Masuk untuk mengelola data seragam dengan lebih teratur.</p></div>

          {error && <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs font-medium text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}

          <form onSubmit={handleSubmit} className="animate-rise flex flex-col gap-5 [animation-delay:180ms]">
            <div className="flex flex-col gap-2"><label htmlFor="login-username" className="text-xs font-bold text-foreground">Username</label><div className="relative"><User aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input id="login-username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" autoComplete="username" className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-accent-foreground focus:ring-4 focus:ring-accent/60" required /></div></div>
            <div className="flex flex-col gap-2"><label htmlFor="login-password" className="text-xs font-bold text-foreground">Password</label><div className="relative"><Lock aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" autoComplete="current-password" className="h-12 w-full rounded-xl border border-input bg-card pl-11 pr-12 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-accent-foreground focus:ring-4 focus:ring-accent/60" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
            <button type="submit" id="btn-submit-login" disabled={loading} className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"><span>{loading ? 'Memproses...' : 'Masuk ke aplikasi'}</span>{!loading && <ArrowRight className="h-4 w-4" />}</button>
          </form>

          <div className="animate-rise mt-5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-center text-[11px] text-muted-foreground [animation-delay:260ms]">Demo: <span className="font-bold text-foreground">admin</span> / <span className="font-bold text-foreground">admin123</span></div>
        </div>
        <footer className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground lg:justify-start"><ShieldCheck className="h-4 w-4 text-accent-foreground" />Akses terbatas untuk pengguna internal PT JAI</footer>
      </section>

      <aside className="login-visual relative hidden min-h-screen overflow-hidden bg-primary px-10 py-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-20"><div className="login-grid absolute inset-0 opacity-25" /><div className="relative z-10 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/70">JAI uniform system</span><span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_var(--accent)]" /></div><div className="relative z-10 max-w-xl"><img src={YAZAKI_LOGO} alt="Yazaki" className="mb-10 h-auto w-48 object-contain brightness-0 invert" /><p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-accent">One source of truth</p><h2 className="text-balance text-4xl font-bold leading-tight tracking-tight xl:text-6xl">Uniform tracking, made clear.</h2><p className="mt-6 max-w-md text-pretty text-base leading-7 text-primary-foreground/70">Kelola pengajuan dan penerimaan seragam secara cepat, akurat, dan terstruktur.</p></div><div className="relative z-10 flex items-center gap-3 text-xs text-primary-foreground/50"><span className="h-px w-10 bg-primary-foreground/30" />PT Jatim Autocomp Indonesia</div></aside>
    </main>
  )
}
