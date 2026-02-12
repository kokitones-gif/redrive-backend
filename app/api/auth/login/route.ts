/**
 * POST /api/auth/login
 * User login endpoint - Supabase backed
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserByEmail } from '@/lib/db/supabase-db'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'instructor']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Get user by email from Supabase
    const user = await getUserByEmail(validatedData.email)

    if (!user || user.role !== validatedData.role) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // Verify password
    if (!verifyPassword(validatedData.password, user.password_hash)) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // Create session cookie
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'instructor',
      avatar: user.avatar,
    })

    return NextResponse.json({
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json({ error: 'ログインに失敗しました' }, { status: 500 })
  }
}
