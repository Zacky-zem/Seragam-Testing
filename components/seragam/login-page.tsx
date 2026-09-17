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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#071b32]">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-5aC5PMxLwXqVaJdrznCIas8Fjw2Str.png')" }} aria-hidden="true" />
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-24">

        <div className="my-auto w-full max-w-md mx-auto rounded-[2rem] border border-white/35 bg-white/15 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-9">
          <div className="mb-8">
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Selamat datang</h2>
            <p className="mt-2 text-sm text-white/75">Masuk untuk mengelola dan memantau distribusi data seragam.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white" htmlFor="login-username">
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
              <label className="mb-1.5 block text-xs font-semibold text-white" htmlFor="login-password">
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

        </div>

        <div className="text-xs text-muted-foreground text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <span>Akses terbatas untuk pengguna internal PT JAI</span>
        </div>
      </div>

    </div>
  )
}
