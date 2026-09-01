'use client'

import React, { useState } from 'react'
import { AlertCircle, ArrowRight, Lock, ShieldCheck, User } from 'lucide-react'

export function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> | void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (e.nativeEvent && 'isComposing' in e.nativeEvent && (e.nativeEvent as any).isComposing) return
    setError('')
    if (!username.trim()) return setError('Username wajib diisi.')
    if (!password.trim()) return setError('Password wajib diisi.')
    setLoading(true)
    try { await onLogin(username, password) } catch { setError('Login gagal. Silakan periksa kembali data Anda.') } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-background p-3 sm:p-5 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-primary/10 sm:min-h-[calc(100vh-2.5rem)] lg:min-h-[calc(100vh-4rem)]">
        <section className="flex w-full flex-col justify-between p-6 sm:p-10 lg:w-[52%] lg:p-14 xl:p-20">
          <div className="flex items-center gap-4">
            <img src="/yazaki-logo.jpeg" alt="Yazaki" className="h-12 w-auto object-contain object-left" />
            <div className="h-9 w-px bg-border" />
            <div><p className="text-sm font-bold text-primary">Data Seragam</p><p className="text-xs text-muted-foreground">PT Jatim Autocomp Indonesia</p></div>
          </div>

          <div className="mx-auto w-full max-w-md py-10">
            <div className="mb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground">Portal internal</p><h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Selamat datang</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Masuk untuk mengelola data seragam dengan lebih teratur.</p></div>
            {error && <div role="alert" className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field id="login-username" label="Username" icon={<User />} value={username} onChange={setUsername} placeholder="Masukkan username" />
              <Field id="login-password" label="Password" icon={<Lock />} value={password} onChange={setPassword} placeholder="Masukkan password" type="password" />
              <button type="submit" id="btn-submit-login" disabled={loading} className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"><span>{loading ? 'Memproses...' : 'Masuk ke aplikasi'}</span>{!loading && <ArrowRight className="h-4 w-4" />}</button>
            </form>
            <p className="mt-5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-center text-xs text-muted-foreground">Demo: <strong className="text-foreground">admin</strong> / <strong className="text-foreground">admin123</strong></p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-accent-foreground" /><span>Akses terbatas untuk pengguna internal PT JAI</span></div>
        </section>

        <aside className="relative hidden w-[48%] overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:items-end xl:p-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--primary-foreground)/.5)_1px,transparent_1px)] [background-size:22px_22px]" />
          <div className="absolute right-[-10%] top-[-12%] h-72 w-72 rounded-full border-[32px] border-accent/20" />
          <div className="relative max-w-lg"><div className="mb-6 h-1 w-14 rounded-full bg-accent" /><h2 className="text-balance text-4xl font-bold leading-tight xl:text-5xl">Satu sumber data untuk distribusi seragam.</h2><p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/70">Pantau pengajuan, ukuran, dan penerimaan secara cepat, akurat, dan terstruktur.</p></div>
        </aside>
      </div>
    </main>
  )
}

function Field({ id, label, icon, value, onChange, placeholder, type = 'text' }: { id: string; label: string; icon: React.ReactNode; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-xs font-bold text-foreground">{label}</label><div className="relative"><span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}</span><input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-input bg-muted/30 pl-10 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-accent-foreground focus:ring-4 focus:ring-accent/20" required /></div></div>
}
