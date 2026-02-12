import { NextRequest, NextResponse } from 'next/server'
import { getInstructorById, getAvailability, updateAvailability } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate parameters are required' }, { status: 400 })
    }

    const instructor = await getInstructorById(id)
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const slots = await getAvailability(id, startDate, endDate)
    const slotsByDate: Record<string, typeof slots> = {}
    slots.forEach((slot) => {
      if (!slotsByDate[slot.date]) slotsByDate[slot.date] = []
      slotsByDate[slot.date].push(slot)
    })

    return NextResponse.json({ instructorId: id, slotsByDate, totalSlots: slots.length })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('instructor')
    const { id } = await params

    if (session.userId !== id) {
      return NextResponse.json({ error: 'Not authorized to update this instructor availability' }, { status: 403 })
    }

    const body = await request.json()
    const { date, period, isAvailable } = body

    if (!date || !period) {
      return NextResponse.json({ error: 'date and period are required' }, { status: 400 })
    }

    if (!['morning', 'afternoon', 'evening'].includes(period)) {
      return NextResponse.json({ error: 'period must be morning, afternoon, or evening' }, { status: 400 })
    }

    const slot = await updateAvailability(id, date, period, isAvailable)
    return NextResponse.json({ message: 'Availability updated', slot })
  } catch (error: any) {
    console.error('Error updating availability:', error)
    if (error.message?.includes('Not authenticated') || error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
  }
}
