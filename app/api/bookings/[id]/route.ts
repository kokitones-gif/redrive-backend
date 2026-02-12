import { NextRequest, NextResponse } from 'next/server'
import { getBookingById, getUserById } from '@/lib/db/supabase-db'
import { requireAuth } from '@/lib/auth/session'

export async function GET(
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
      return NextResponse.json({ error: 'Not authorized to view this booking' }, { status: 403 })
    }

    const student = await getUserById(booking.student_id)
    const instructor = await getUserById(booking.instructor_id)

    return NextResponse.json({
      booking: {
        ...booking,
        student: student ? { id: student.id, name: student.name, avatar: student.avatar, email: student.email } : null,
        instructor: instructor ? { id: instructor.id, name: instructor.name, avatar: instructor.avatar, email: instructor.email } : null,
      },
    })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
