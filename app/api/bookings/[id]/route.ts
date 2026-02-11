import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireAuth } from '@/lib/auth/session'

/**
 * GET /api/bookings/:id
 * Get booking detail (only accessible by student or instructor involved)
 */
export async function GET(
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
        { error: 'Not authorized to view this booking' },
        { status: 403 }
      )
    }

    // Enrich with user and course info
    const student = db.getUserById(booking.studentId)
    const instructor = db.getUserById(booking.instructorId)
    const coursePricing = db.getCoursePricing(booking.instructorId).find((c) => c.id === booking.courseId)

    return NextResponse.json({
      booking: {
        ...booking,
        student: student ? { id: student.id, name: student.name, avatar: student.avatar, email: student.email } : null,
        instructor: instructor ? { id: instructor.id, name: instructor.name, avatar: instructor.avatar, email: instructor.email } : null,
        course: coursePricing,
      },
    })
  } catch (error: any) {
    console.error('Error fetching booking:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
