import { NextRequest, NextResponse } from 'next/server'
import { getBookingById, updateBookingStatus } from '@/lib/db/supabase-db'
import { requireAuth } from '@/lib/auth/session'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const booking = await getBookingById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (session.userId !== booking.student_id && session.userId !== booking.instructor_id) {
      return NextResponse.json({ error: 'Not authorized to cancel this booking' }, { status: 403 })
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return NextResponse.json({ error: `Cannot cancel booking with status: ${booking.status}` }, { status: 400 })
    }

    const updatedBooking = await updateBookingStatus(id, 'cancelled')
    return NextResponse.json({ message: 'Booking cancelled', booking: updatedBooking })
  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
  }
}
