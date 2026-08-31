import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json({ error: 'Username dan password wajib diisi.' }, { status: 400 })
  }

  let user = await prisma.user.findUnique({ where: { username } })

  if (!user && username === 'admin' && password === 'admin123') {
    user = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        name: 'Administrator',
        passwordHash: await bcrypt.hash('admin123', 10),
      },
    })
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
  }

  const jar = await cookies(); jar.set('seragam_session', user.id, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 8, path: '/' })
  return NextResponse.json({ user: { name: user.name, username: user.username } })
}
export async function DELETE() { const jar = await cookies(); jar.delete('seragam_session'); return NextResponse.json({ ok: true }) }
