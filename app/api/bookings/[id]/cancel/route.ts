import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireAuth } from '@/lib/auth/session'

/**
 * POST /api/bookings/:id/cancel
 * Cancel booking (available to both student and instructor)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()

    await db.init()

    const { id } = await params

    const booking = db.getBookingById(id)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify access
    if (session.userId !== booking.studentId && session.userId !== booking.instructorId) {
      return NextResponse.json(
        { error: 'Not authorized to cancel this booking' },
        { status: 403 }
      )
    }

    // Verify booking can be cancelled
    if (['cancelled', 'completed'].includes(booking.status)) {
      return NextResponse.json(
        { error: `Cannot cancel booking with status: ${booking.status}` },
        { status: 400 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const reason = body.reason

    // Update booking status
    const updatedBooking = db.updateBookingStatus(id, 'cancelled')

    // Create notification for the other party
    const otherUserId = session.userId === booking.studentId ? booking.instructorId : booking.studentId
    const otherUser = db.getUserById(otherUserId)

    if (otherUser) {
      const message = reason
        ? `Booking cancelled. Reason: ${reason}`
        : 'Booking cancelled'

      db.createNotification({
        userId: otherUserId,
        type: 'booking',
        title: 'Booking Cancelled',
        message,
        isRead: false,
        data: { bookingId: id },
      })
    }

    return NextResponse.json({
      message: 'Booking cancelled',
      booking: updatedBooking,
    })
  } catch (error: any) {
    console.error('Error cancelling booking:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
