import { NextRequest, NextResponse } from 'next/server'
import { getBookingsByInstructor } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('instructor')
    const allBookings = await getBookingsByInstructor(session.userId)
    const completedBookings = allBookings.filter((b) => b.status === 'completed')

    const now = new Date()
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0')
    const currentMonthBookings = completedBookings.filter((b) => b.date.startsWith(currentMonth))
    const currentMonthGross = currentMonthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const currentMonthEarnings = Math.round(currentMonthGross * 0.8 * 100) / 100
    const currentMonthCommission = Math.round(currentMonthGross * 0.2 * 100) / 100

    const monthlyHistory: Array<{ month: string; gross: number; earnings: number; commission: number; bookingCount: number }> = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
      const monthBookings = completedBookings.filter((b) => b.date.startsWith(month))
      const gross = monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
      monthlyHistory.push({
        month,
        gross,
        earnings: Math.round(gross * 0.8 * 100) / 100,
        commission: Math.round(gross * 0.2 * 100) / 100,
        bookingCount: monthBookings.length,
      })
    }

    const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed')
    const pendingEarnings = Math.round(confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0) * 0.8, 0) * 100) / 100

    const totalGross = completedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
    const totalEarnings = Math.round(totalGross * 0.8 * 100) / 100
    const totalCommission = Math.round(totalGross * 0.2 * 100) / 100

    return NextResponse.json({
      earnings: {
        currentMonth: { month: currentMonth, gross: currentMonthGross, earnings: currentMonthEarnings, commission: currentMonthCommission, bookingCount: currentMonthBookings.length },
        monthlyHistory,
        pendingEarnings,
        total: { earnings: totalEarnings, gross: totalGross, commission: totalCommission, completedBookings: completedBookings.length, confirmedBookings: confirmedBookings.length },
      },
      commissionRate: 0.2,
    })
  } catch (error: any) {
    console.error('Error fetching earnings:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch earnings' }, { status: 500 })
  }
}
