import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * GET /api/mypage
 * Get student dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('student')

    await db.init()

    // Get student's bookings
    const allBookings = db.getBookingsByStudent(session.userId)

    // Split into upcoming and past
    const now = new Date().toISOString()
    const upcomingBookings = allBookings.filter((b) => b.date >= now && !['cancelled', 'rejected'].includes(b.status))
    const pastBookings = allBookings.filter((b) => b.date < now || b.status === 'completed')

    // Sort
    upcomingBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    pastBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Enrich bookings
    const enrichBooking = (booking: any) => {
      const instructor = db.getUserById(booking.instructorId)
      const instructorProfile = db.getInstructorProfile(booking.instructorId)
      const course = db.getCoursePricing(booking.instructorId).find((c) => c.id === booking.courseId)

      return {
        ...booking,
        instructor: instructor ? {
          id: instructor.id,
          name: instructor.name,
          avatar: instructor.avatar,
        } : null,
        instructorProfile: instructorProfile ? {
          rating: instructorProfile.rating,
          experience: instructorProfile.experience,
        } : null,
        course,
      }
    }

    // Get notifications
    const notifications = db.getNotifications(session.userId)
    const unreadNotifications = notifications.filter((n) => !n.isRead)

    // Get reviews written by student
    const reviews = db.getReviewsByStudent(session.userId)

    // Get purchased courses info (from past bookings)
    const coursesCount = new Set(pastBookings.map((b) => b.courseId)).size

    return NextResponse.json({
      student: session,
      dashboard: {
        upcomingBookings: upcomingBookings.map(enrichBooking).slice(0, 5),
        upcomingCount: upcomingBookings.length,
        pastBookings: pastBookings.map(enrichBooking).slice(0, 5),
        pastCount: pastBookings.length,
        notifications: unreadNotifications.slice(0, 10),
        unreadNotificationCount: unreadNotifications.length,
        reviews: reviews.length,
        coursesCount,
      },
    })
  } catch (error: any) {
    console.error('Error fetching student dashboard:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Students only' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    )
  }
}
