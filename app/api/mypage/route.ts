import { NextRequest, NextResponse } from 'next/server'
import { getBookingsByStudent, getUserById, getInstructorProfile, getReviewsByStudent } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('student')
    const allBookings = await getBookingsByStudent(session.userId)

    const now = new Date().toISOString()
    const upcomingBookings = allBookings.filter((b) => b.date >= now && !['cancelled', 'rejected'].includes(b.status))
    const pastBookings = allBookings.filter((b) => b.date < now || b.status === 'completed')

    upcomingBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    pastBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const enrichBooking = async (booking: any) => {
      // Try to get instructor from users table, fall back to stored booking data
      let instructorData = null
      let profileData = null
      try {
        const instructor = await getUserById(booking.instructor_id)
        if (instructor) {
          instructorData = { id: instructor.id, name: instructor.name, avatar: instructor.avatar }
          const profile = await getInstructorProfile(booking.instructor_id)
          if (profile) {
            profileData = { rating: profile.rating, experience: profile.experience }
          }
        }
      } catch {
        // instructor_id is not a UUID - use stored data from booking record
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
        instructor: instructorData,
        instructorProfile: profileData,
      }
    }

    const reviews = await getReviewsByStudent(session.userId)
    const coursesCount = new Set(pastBookings.map((b: any) => b.course_name)).size

    return NextResponse.json({
      student: session,
      dashboard: {
        upcomingBookings: await Promise.all(upcomingBookings.slice(0, 5).map(enrichBooking)),
        upcomingCount: upcomingBookings.length,
        pastBookings: await Promise.all(pastBookings.slice(0, 5).map(enrichBooking)),
        pastCount: pastBookings.length,
        reviews: reviews.length,
        coursesCount,
      },
    })
  } catch (error: any) {
    console.error('Error fetching student dashboard:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Students only' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
