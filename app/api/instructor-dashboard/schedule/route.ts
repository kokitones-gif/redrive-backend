import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * GET /api/instructor-dashboard/schedule
 * Get instructor's schedule for a given month
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('instructor')

    await db.init()

    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') || String(new Date().getMonth() + 1).padStart(2, '0')
    const year = searchParams.get('year') || String(new Date().getFullYear())

    // Build date range
    const startDate = `${year}-${month}-01`
    const endDate = `${year}-${month}-31` // Last day varies, but we filter anyway

    // Get availability for the month
    const slots = db.getAvailability(session.userId, startDate, endDate)

    // Get bookings for the month
    const allBookings = db.getBookingsByInstructor(session.userId)
    const monthBookings = allBookings.filter((b) => b.date.startsWith(`${year}-${month}`))

    // Enrich bookings
    const enrichBooking = (booking: any) => {
      const student = db.getUserById(booking.studentId)
      const course = db.getCoursePricing(session.userId).find((c) => c.id === booking.courseId)

      return {
        ...booking,
        student: student ? {
          id: student.id,
          name: student.name,
          avatar: student.avatar,
        } : null,
        course,
      }
    }

    // Group slots by date
    const slotsByDate: Record<string, typeof slots> = {}
    slots.forEach((slot) => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = []
      }
      slotsByDate[slot.date].push(slot)
    })

    return NextResponse.json({
      period: { month: parseInt(month), year: parseInt(year) },
      slots: slotsByDate,
      totalSlots: slots.length,
      bookings: monthBookings.map(enrichBooking),
      totalBookings: monthBookings.length,
    })
  } catch (error: any) {
    console.error('Error fetching schedule:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Instructors only' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/instructor-dashboard/schedule
 * Update instructor's schedule (bulk update)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole('instructor')

    await db.init()

    const body = await request.json()
    const { date, slots } = body

    if (!date || !slots) {
      return NextResponse.json(
        { error: 'date and slots are required' },
        { status: 400 }
      )
    }

    if (typeof slots !== 'object' || !slots.morning === undefined || !slots.afternoon === undefined || !slots.evening === undefined) {
      return NextResponse.json(
        { error: 'slots must be an object with morning, afternoon, and evening boolean properties' },
        { status: 400 }
      )
    }

    // Update availability for each period
    const updatedSlots = []

    if (slots.morning !== undefined) {
      updatedSlots.push(db.updateAvailability(session.userId, date, 'morning', slots.morning))
    }

    if (slots.afternoon !== undefined) {
      updatedSlots.push(db.updateAvailability(session.userId, date, 'afternoon', slots.afternoon))
    }

    if (slots.evening !== undefined) {
      updatedSlots.push(db.updateAvailability(session.userId, date, 'evening', slots.evening))
    }

    return NextResponse.json({
      message: 'Schedule updated',
      date,
      slots: updatedSlots,
    })
  } catch (error: any) {
    console.error('Error updating schedule:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Instructors only' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}
