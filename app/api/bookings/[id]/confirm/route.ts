import { NextRequest, NextResponse } from 'next/server'
import { getBookingById, updateBookingStatus } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('instructor')
    const { id } = await params

    const booking = await getBookingById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (session.userId !== booking.instructor_id) {
      return NextResponse.json({ error: 'Not authorized to confirm this booking' }, { status: 403 })
    }

    if (booking.status !== 'pending') {
      return NextResponse.json({ error: `Cannot confirm booking with status: ${booking.status}` }, { status: 400 })
    }

    const updatedBooking = await updateBookingStatus(id, 'confirmed')
    return NextResponse.json({ message: 'Booking confirmed', booking: updatedBooking })
  } catch (error: any) {
    console.error('Error confirming booking:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only can confirm bookings' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to confirm booking' }, { status: 500 })
  }
}
