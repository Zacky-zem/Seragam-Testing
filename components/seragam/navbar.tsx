'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Info, Layers, LogIn, LogOut, Sparkles } from 'lucide-react'
import type { UserSession } from '@/types/seragam'

export function Navbar({ currentView, user, onLogout }: { currentView: 'landing' | 'tracking'; user: UserSession | null; onLogout: () => void }) {
  const isLoggedIn = Boolean(user?.isLoggedIn)
  const navItems = [
    { href: '/landingpage', label: 'Home', icon: Home, active: currentView === 'landing' },
    { href: '/seragam', label: 'Data Seragam', icon: Layers, active: currentView === 'tracking' },
    { href: '/landingpage#about', label: 'About', icon: Info, active: false },
  ]

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8 no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[1.35rem] border border-white/60 bg-slate-950/90 px-3 py-2.5 text-white shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:px-4">
        <Link href="/landingpage" className="flex shrink-0 items-center gap-2.5 rounded-full px-2 py-1" aria-label="Kembali ke menu utama">
          <span className="grid size-9 place-items-center rounded-full bg-white text-[#143254] shadow-inner"><Sparkles className="size-4" /></span>
          <span className="hidden text-sm font-bold tracking-tight sm:block">SERAGAM<span className="text-sky-300">.JAI</span></span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Navigasi utama">
          {navItems.map(({ href, label, icon: Icon, active }) => (
            <Link key={label} href={href} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 ${active ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              <Icon className="size-3.5" /><span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </nav>
        {isLoggedIn ? (
          <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1 text-slate-950 sm:pl-3">
            <div className="hidden text-right sm:block"><p className="text-[11px] font-bold leading-tight">{user?.fullName}</p><p className="text-[10px] text-slate-500">{user?.username}</p></div>
            <button onClick={onLogout} title="Keluar dari aplikasi" className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-red-50 hover:text-red-600"><LogOut className="size-3.5" /></button>
          </div>
        ) : (
          <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white hover:text-slate-950 sm:px-4"><LogIn className="size-3.5" /><span>Masuk</span></Link>
        )}
      </div>
    </header>
  )
}
