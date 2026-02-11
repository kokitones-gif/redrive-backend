/**
 * GET /api/auth/session
 * Get current session endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({ user: session })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 })
  }
}
