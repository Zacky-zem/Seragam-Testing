'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Home, Layers, LogOut } from 'lucide-react'
import type { UserSession } from '@/types/seragam'

export function Navbar({ currentView, user, onLogout }: { currentView: 'landing' | 'tracking'; user: UserSession; onLogout: () => void }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-sm backdrop-blur no-print">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/landingpage" className="flex shrink-0 items-center" aria-label="Kembali ke menu utama">
          <Image src="/yazaki-logo.jpeg" alt="Logo Yazaki" width={200} height={80} className="h-12 w-auto object-contain sm:h-14" priority />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDate}</span>
          </div>

          {currentView === 'tracking' ? (
            <Link
              id="btn-nav-home"
              href="/landingpage"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-600" />
              <span>Menu Utama</span>
            </Link>
          ) : (
            <Link
              id="btn-nav-tracking"
              href="/seragam"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#143254] hover:bg-[#1d4470] transition-colors shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Data Seragam</span>
            </Link>
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
