'use client'

import { Calendar, Home, Layers, LogOut } from 'lucide-react'
import type { UserSession } from './types'

export function Navbar({ currentView, onNavigate, user, onLogout }: { currentView: 'landing' | 'tracking'; onNavigate: (view: 'landing' | 'tracking') => void; user: UserSession; onLogout: () => void }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div onClick={() => onNavigate('landing')} className="flex cursor-pointer select-none items-center gap-3.5 group" id="navbar-brand-logo">
          <img src="/yazaki-logo.jpeg" alt="Yazaki" className="h-9 w-auto object-contain object-left" />
          <div className="h-8 w-px bg-border" />
          <div>
            <h1 className="flex items-center gap-2 text-base font-bold leading-tight tracking-tight text-foreground">Data Seragam <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">PT JAI</span></h1>
            <p className="text-xs font-medium text-muted-foreground">PT Jatim Autocomp Indonesia</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
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
