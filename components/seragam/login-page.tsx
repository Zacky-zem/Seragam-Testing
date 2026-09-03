'use client'

import React, { useState } from 'react'
import { AlertCircle, ArrowRight, Lock, ShieldCheck, Shirt, User } from 'lucide-react'

export function LoginPage({ onLogin }: { onLogin: (username: string, password: string) => Promise<void> | void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username wajib diisi.')
      return
    }

    if (!password.trim()) {
      setError('Password wajib diisi.')
      return
    }

    setLoading(true)
    try {
      await onLogin(username, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-24 bg-card">
        <div className="flex items-center gap-3">
          <div >
          </div>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-foreground mt-3 tracking-tight">Selamat datang</h2>
            <p className="text-sm text-muted-foreground mt-2">Masuk untuk mengelola dan memantau distribusi data seragam.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="login-username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username anda"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring text-foreground transition-all placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring text-foreground transition-all placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{loading ? 'Memproses Masuk...' : 'Login ke Aplikasi'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-muted border border-border rounded-xl text-center">
            <p className="text-[11px] text-muted-foreground">
              Demo Access: User <span className="font-semibold text-foreground">admin</span> / Password <span className="font-semibold text-foreground">admin123</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <span>Akses terbatas untuk pengguna internal PT JAI</span>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-primary relative flex-col items-center justify-center p-12 xl:p-20 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-md text-left">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-primary-foreground/75 uppercase">
            Uniform System
          </span>

          <h3 className="mt-6 text-4xl font-extrabold tracking-tight text-primary-foreground leading-tight mb-4">
            One source of truth for uniform tracking.
          </h3>
          <p className="text-base text-primary-foreground/75 font-normal leading-relaxed">
            Kelola data pengajuan seragam dan catat update kedatangan seragam dengan cepat, akurat, dan terstruktur.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary-foreground">24/7</p>
              <p className="mt-1 text-xs text-primary-foreground/75">Monitoring data</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold text-primary-foreground">100%</p>
              <p className="mt-1 text-xs text-primary-foreground/75">Terkonsolidasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
