import { NextRequest, NextResponse } from 'next/server'
import { getBookingsByStudent, getBookingsByInstructor, getUserById, createBooking } from '@/lib/db/supabase-db'
import { requireAuth, requireRole } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    let bookings
    if (session.role === 'student') {
      bookings = await getBookingsByStudent(session.userId)
    } else if (session.role === 'instructor') {
      bookings = await getBookingsByInstructor(session.userId)
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (status) {
      bookings = bookings.filter((booking) => booking.status === status)
    }

    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const enriched = await Promise.all(
      bookings.map(async (booking: any) => {
        const student = await getUserById(booking.student_id)
        // Try to get instructor from users table, fall back to stored data
        let instructorData = null
        try {
          const instructor = await getUserById(booking.instructor_id)
          if (instructor) {
            instructorData = { id: instructor.id, name: instructor.name, avatar: instructor.avatar }
          }
        } catch {
          // instructor_id is not a UUID, use stored data
        }

        if (!instructorData) {
          instructorData = {
            id: booking.instructor_id,
            name: booking.instructor_name || `講師 ${booking.instructor_id}`,
            avatar: booking.instructor_avatar || '/placeholder.svg',
          }
        }

        return {
          ...booking,
          student: student ? { id: student.id, name: student.name, avatar: student.avatar } : null,
          instructor: instructorData,
        }
      })
    )

    return NextResponse.json({ data: enriched, total: enriched.length })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('student')
    const body = await request.json()
    const { instructorId, instructorName, instructorAvatar, date, timeSlot, location, courseName, useInstructorVehicle, notes, totalPrice } = body

    if (!instructorId || !date || !timeSlot || !location) {
      return NextResponse.json({ error: 'Missing required fields: instructorId, date, timeSlot, location' }, { status: 400 })
    }

    const booking = await createBooking({
      student_id: session.userId,
      instructor_id: String(instructorId),
      date,
      time_slot: timeSlot,
      location,
      course_name: courseName || null,
      status: 'pending',
      use_instructor_vehicle: useInstructorVehicle || false,
      total_price: totalPrice || null,
      notes: notes || null,
      instructor_name: instructorName || null,
      instructor_avatar: instructorAvatar || null,
    })

    return NextResponse.json({ message: 'Booking created successfully', booking }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Students only can create bookings' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
