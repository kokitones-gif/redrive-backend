/**
 * POST /api/auth/register
 * User registration endpoint - Supabase backed
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createUser, getUserByEmail } from '@/lib/db/supabase-db'
import { hashPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'instructor']),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check for duplicate email
    const existingUser = await getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 400 })
    }

    // Hash password
    const passwordHash = hashPassword(validatedData.password)

    // Create user in Supabase
    const user = await createUser({
      email: validatedData.email,
      password_hash: passwordHash,
      name: validatedData.name,
      role: validatedData.role,
      phone: validatedData.phone,
    })

    // Create session cookie
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'instructor',
      avatar: user.avatar,
    })

    return NextResponse.json(
      {
        user: {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 })
  }
}
