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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-24 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#143254] flex items-center justify-center text-white shadow-xs">
            <Shirt className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Data Seragam</h1>
            <p className="text-xs font-medium text-slate-500">PT Jatim Autocomp Indonesia</p>
          </div>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <span className="text-[11px] font-bold tracking-widest uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              INTERNAL APPLICATION
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">Selamat datang kembali</h2>
            <p className="text-sm text-slate-500 mt-2">Masuk untuk mengelola dan memantau distribusi seragam kerja berbasis Nomor PR.</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username anda"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-blue-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-blue-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#143254] hover:bg-[#1c4573] active:bg-[#0f253e] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <span>{loading ? 'Memproses Masuk...' : 'Login ke Aplikasi'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[11px] text-slate-500">
              Demo Access: User <span className="font-semibold text-slate-700">admin</span> / Password <span className="font-semibold text-slate-700">admin123</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Akses terbatas untuk pengguna internal PT JAI</span>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#122e4d] relative flex-col items-center justify-center p-12 xl:p-20 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 max-w-md text-left">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-inner">
            <Shirt className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            One source of truth for uniform tracking.
          </h3>
          <p className="text-base text-blue-100 font-normal leading-relaxed">
            Kelola data pengajuan seragam dan catat update kedatangan seragam secara otomatis berbasis Nomor PR dengan cepat, akurat, dan terstruktur.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-white mb-0.5">100%</div>
              <div className="text-xs text-blue-200">Tracking Berbasis No. PR</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-white mb-0.5">Bulk XLS</div>
              <div className="text-xs text-blue-200">Upload & Update Cepat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
