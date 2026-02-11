/**
 * POST /api/auth/register
 * User registration endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db/database'
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

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Initialize database
    await db.init()

    // Check for duplicate email
    const existingUser = db.getUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Hash password
    const passwordHash = hashPassword(validatedData.password)

    // Create user
    const user = db.createUser({
      email: validatedData.email,
      passwordHash,
      name: validatedData.name,
      role: validatedData.role,
      phone: validatedData.phone,
      avatar: undefined,
    })

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    })

    // Return user data (without password) - userId matches session format
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
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
