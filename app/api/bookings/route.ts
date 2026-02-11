import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireAuth, requireRole } from '@/lib/auth/session'

/**
 * GET /api/bookings
 * Get my bookings (student sees their bookings, instructor sees booking requests)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    await db.init()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')

    let bookings
    if (session.role === 'student') {
      bookings = db.getBookingsByStudent(session.userId)
    } else if (session.role === 'instructor') {
      bookings = db.getBookingsByInstructor(session.userId)
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Filter by status if provided
    if (status) {
      bookings = bookings.filter((booking) => booking.status === status)
    }

    // Sort by date descending
    bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Enrich with user and instructor info
    const enriched = bookings.map((booking) => {
      const student = db.getUserById(booking.studentId)
      const instructor = db.getUserById(booking.instructorId)
      const coursePricing = db.getCoursePricing(booking.instructorId).find((c) => c.id === booking.courseId)

      return {
        ...booking,
        student: student ? { id: student.id, name: student.name, avatar: student.avatar } : null,
        instructor: instructor ? { id: instructor.id, name: instructor.name, avatar: instructor.avatar } : null,
        course: coursePricing,
      }
    })

    return NextResponse.json({
      data: enriched,
      total: enriched.length,
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/bookings
 * Create booking request (student only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('student')

    await db.init()

    const body = await request.json()
    const {
      instructorId,
      courseId,
      date,
      timeSlot,
      location,
      transmissionType,
      useInstructorCar,
      meetingPoint,
      notes,
    } = body

    // Validate required fields
    if (!instructorId || !courseId || !date || !timeSlot || !location || !transmissionType) {
      return NextResponse.json(
        { error: 'Missing required fields: instructorId, courseId, date, timeSlot, location, transmissionType' },
        { status: 400 }
      )
    }

    // Verify instructor exists
    const instructor = db.getInstructorById(instructorId)
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    // Verify course pricing exists
    const coursePricing = db.getCoursePricing(instructorId).find((c) => c.id === courseId)
    if (!coursePricing) {
      return NextResponse.json(
        { error: 'Course pricing not found' },
        { status: 404 }
      )
    }

    // Check availability (soft check - if no slots defined, allow booking)
    const slots = db.getAvailability(instructorId, date, date)
    if (slots.length > 0) {
      const slotAvailable = slots.find((s) => s.period === timeSlot && s.isAvailable)
      if (!slotAvailable) {
        return NextResponse.json(
          { error: 'Time slot not available' },
          { status: 400 }
        )
      }
    }

    // Create booking
    const booking = db.createBooking({
      studentId: session.userId,
      instructorId,
      courseId,
      date,
      timeSlot: timeSlot as 'morning' | 'afternoon' | 'evening',
      location,
      status: 'pending',
      transmissionType: transmissionType as 'AT' | 'MT',
      useInstructorCar,
      meetingPoint,
      notes,
      totalPrice: coursePricing.price,
    })

    // Create notification for instructor
    db.createNotification({
      userId: instructorId,
      type: 'booking',
      title: 'New Booking Request',
      message: `You have a new booking request from ${session.name}`,
      isRead: false,
      data: { bookingId: booking.id },
    })

    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Students only can create bookings' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
