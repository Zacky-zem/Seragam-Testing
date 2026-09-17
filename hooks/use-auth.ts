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

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth')
        const data = response.ok ? await response.json() : null
        const sessionUser = data?.user

        if (!active) return
        if (sessionUser) {
          setUser({ username: sessionUser.username, fullName: sessionUser.name, role: 'admin', isLoggedIn: true })
          if (page === 'login') router.replace('/landingpage')
        }
      } catch {
        // Public pages remain readable even when the session endpoint is unavailable.
      } finally {
        if (active) setIsCheckingSession(false)
      }
    }

    checkSession()
    return () => { active = false }
  }, [page, router])

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const raw = await response.text()
    let data: { user?: { username: string; name: string }; error?: string } = {}
    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      data = {}
    }

    if (!response.ok) throw new Error(data?.error || 'Server login tidak merespons dengan benar.')

    setUser({ username: data.user.username, fullName: data.user.name, role: 'admin', isLoggedIn: true })
    router.push('/landingpage')
  }

  const logout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
    } finally {
      setUser(null)
      router.replace('/login')
    }
  }

  return { isCheckingSession, login, logout, user }
}
