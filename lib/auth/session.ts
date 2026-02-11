/**
 * Session management - Cookie-based session handling
 * Stores session data as base64-encoded JSON in HTTP-only cookie
 */

import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'redrive-session'

export interface SessionData {
  userId: string
  email: string
  name: string
  role: 'student' | 'instructor'
  avatar?: string
}

/**
 * Create a session by setting an HTTP-only cookie with JSON data (base64 encoded)
 */
export async function createSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64')

  cookieStore.set(SESSION_COOKIE_NAME, encodedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) {
      return null
    }

    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    const sessionData = JSON.parse(decoded) as SessionData

    return sessionData
  } catch {
    return null
  }
}

/**
 * Destroy the session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    throw new Error('Not authenticated')
  }

  return session
}

/**
 * Require specific role
 */
export async function requireRole(role: 'student' | 'instructor'): Promise<SessionData> {
  const session = await requireAuth()

  if (session.role !== role) {
    throw new Error(`Not authorized - requires ${role} role`)
  }

  return session
}
