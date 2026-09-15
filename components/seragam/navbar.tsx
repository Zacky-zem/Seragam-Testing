'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Home, Layers3, LogIn, LogOut, Menu, Sparkles, X } from 'lucide-react'
import type { UserSession } from '@/types/seragam'

export function Navbar({ currentView, user, onLogout, onLogin }: { currentView: 'landing' | 'tracking'; user: UserSession | null; onLogout: () => void; onLogin: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  const navItems = [{ href: '/landingpage', label: 'Home', icon: Home }, { href: '/seragam', label: 'Data Seragam', icon: Layers3 }, { href: '/landingpage#about', label: 'About', icon: Sparkles }]
  return <header className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 no-print"><nav className={`pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/20 bg-[#061a31]/90 p-2 text-white shadow-2xl shadow-[#061a31]/20 backdrop-blur-xl transition-all duration-500 ${scrolled ? 'max-w-3xl' : ''}`}>
    <Link href="/landingpage" className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5" aria-label="JAI Uniform home"><Image src="/yazaki-logo.jpeg" alt="Logo Yazaki" width={100} height={40} className="h-8 w-auto rounded-md object-contain" /><span className="hidden text-xs font-bold tracking-widest text-white/80 sm:inline">UNIFORM HUB</span></Link>
    <div className={`${expanded ? 'flex' : 'hidden'} absolute left-2 right-2 top-[calc(100%+8px)] flex-col gap-1 rounded-3xl border border-white/15 bg-[#061a31]/95 p-2 shadow-xl backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:justify-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setExpanded(false)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${currentView === (label === 'Data Seragam' ? 'tracking' : 'landing') && label !== 'About' ? 'bg-white text-[#082343]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon className="size-4" />{label}</Link>)}</div>
    <div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#082343] sm:flex">{user?.fullName || user?.username || 'Guest'}</div>{user ? <button onClick={onLogout} aria-label="Logout" className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"><LogOut className="size-4" /></button> : <button onClick={onLogin} className="hidden items-center gap-2 rounded-full bg-cyan-300 px-4 py-2 text-xs font-bold text-[#082343] hover:bg-white sm:flex"><LogIn className="size-4" /> Masuk</button>}<button onClick={() => setExpanded((value) => !value)} className="rounded-full p-2 text-white/80 hover:bg-white/10 md:hidden" aria-label={expanded ? 'Tutup menu' : 'Buka menu'}>{expanded ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
  </nav></header>
}
