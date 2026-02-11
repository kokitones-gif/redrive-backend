import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * POST /api/bookings/:id/confirm
 * Confirm booking (instructor only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('instructor')

    await db.init()

    const { id } = await params

    const booking = db.getBookingById(id)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify instructor is the one confirming
    if (session.userId !== booking.instructorId) {
      return NextResponse.json(
        { error: 'Not authorized to confirm this booking' },
        { status: 403 }
      )
    }

    // Verify booking is pending
    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot confirm booking with status: ${booking.status}` },
        { status: 400 }
      )
    }

    // Update booking status
    const updatedBooking = db.updateBookingStatus(id, 'confirmed')

    // Create notification for student
    const student = db.getUserById(booking.studentId)
    if (student) {
      db.createNotification({
        userId: booking.studentId,
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your booking with ${session.name} on ${booking.date} has been confirmed`,
        isRead: false,
        data: { bookingId: id },
      })
    }

    return NextResponse.json({
      message: 'Booking confirmed',
      booking: updatedBooking,
    })
  } catch (error: any) {
    console.error('Error confirming booking:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Instructors only can confirm bookings' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    )
  }
}
