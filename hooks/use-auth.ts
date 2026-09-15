'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AppPage, UserSession } from '@/types/seragam'

export function useAuth(page: AppPage) {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth')
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!active) return
        const sessionUser = data?.user
        if (sessionUser) setUser({ username: sessionUser.username, fullName: sessionUser.name, role: 'admin', isLoggedIn: true })
        if (sessionUser && page === 'login') router.replace('/landingpage')
      })
      .catch(() => undefined)
      .finally(() => { if (active) setIsCheckingSession(false) })
    return () => { active = false }
  }, [page, router])

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    const data = await response.json()
    if (!response.ok) throw new Error(data?.error || 'Username atau password salah.')
    setUser({ username: data.user.username, fullName: data.user.name, role: 'admin', isLoggedIn: true })
    router.push('/landingpage')
  }

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => undefined)
    setUser(null)
    router.replace('/landingpage')
  }

  return { isCheckingSession, login, logout, user }
}
