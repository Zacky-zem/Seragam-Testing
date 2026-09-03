'use client'

import Image from 'next/image'
import { Calendar, Home, Layers, LogOut } from 'lucide-react'
import type { UserSession } from './types'

export function Navbar({ currentView, onNavigate, user, onLogout }: { currentView: 'landing' | 'tracking'; onNavigate: (view: 'landing' | 'tracking') => void; user: UserSession; onLogout: () => void }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur no-print">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={() => onNavigate('landing')} className="group flex min-w-0 items-center gap-3 text-left select-none" id="navbar-brand-logo" aria-label="Kembali ke menu utama">
          <div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm ring-1 ring-border">
            <Image src="/yazaki-logo.jpeg" alt="Logo Yazaki" width={120} height={48} className="h-full w-full object-contain" priority />
          </div>
          <div className="min-w-0">
            <h1 className="flex items-center gap-2 truncate text-sm font-bold leading-tight tracking-tight text-foreground sm:text-base">
              Seragam JAI
            </h1>
            <p className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">PT Jatim Autocomp Indonesia</p>
          </div>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDate}</span>
          </div>

          {currentView === 'tracking' ? (
            <button
              id="btn-nav-home"
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span>Menu Utama</span>
            </button>
          ) : (
            <button
              id="btn-nav-tracking"
              onClick={() => onNavigate('tracking')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#143254] hover:bg-[#1d4470] transition-colors shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Data Seragam</span>
            </button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user.fullName}</div>
              <div className="text-[11px] text-slate-500">{user.role}</div>
            </div>

            <button
              id="btn-logout"
              onClick={onLogout}
              title="Keluar dari Aplikasi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
