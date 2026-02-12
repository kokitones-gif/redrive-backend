import { NextRequest, NextResponse } from 'next/server'
import { getAvailability, getBookingsByInstructor, getUserById, updateAvailability } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('instructor')
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') || String(new Date().getMonth() + 1).padStart(2, '0')
    const year = searchParams.get('year') || String(new Date().getFullYear())

    const startDate = `${year}-${month}-01`
    const endDate = `${year}-${month}-31`

    const slots = await getAvailability(session.userId, startDate, endDate)
    const allBookings = await getBookingsByInstructor(session.userId)
    const monthBookings = allBookings.filter((b) => b.date.startsWith(`${year}-${month}`))

    const enrichBooking = async (booking: any) => {
      const student = await getUserById(booking.student_id)
      return {
        ...booking,
        student: student ? { id: student.id, name: student.name, avatar: student.avatar } : null,
      }
    }

    const slotsByDate: Record<string, typeof slots> = {}
    slots.forEach((slot) => {
      if (!slotsByDate[slot.date]) slotsByDate[slot.date] = []
      slotsByDate[slot.date].push(slot)
    })

    return NextResponse.json({
      period: { month: parseInt(month), year: parseInt(year) },
      slots: slotsByDate,
      totalSlots: slots.length,
      bookings: await Promise.all(monthBookings.map(enrichBooking)),
      totalBookings: monthBookings.length,
    })
  } catch (error: any) {
    console.error('Error fetching schedule:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole('instructor')
    const body = await request.json()
    const { date, slots } = body

    if (!date || !slots) {
      return NextResponse.json({ error: 'date and slots are required' }, { status: 400 })
    }

    const updatedSlots = []
    if (slots.morning !== undefined) {
      updatedSlots.push(await updateAvailability(session.userId, date, 'morning', slots.morning))
    }
    if (slots.afternoon !== undefined) {
      updatedSlots.push(await updateAvailability(session.userId, date, 'afternoon', slots.afternoon))
    }
    if (slots.evening !== undefined) {
      updatedSlots.push(await updateAvailability(session.userId, date, 'evening', slots.evening))
    }

    return NextResponse.json({ message: 'Schedule updated', date, slots: updatedSlots })
  } catch (error: any) {
    console.error('Error updating schedule:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 })
  }
}
