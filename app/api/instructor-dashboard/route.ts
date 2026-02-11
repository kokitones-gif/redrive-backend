import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * GET /api/instructor-dashboard
 * Get instructor dashboard data
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('instructor')

    await db.init()

    // Get instructor's bookings
    const allBookings = db.getBookingsByInstructor(session.userId)

    // Get pending bookings
    const pendingBookings = allBookings.filter((b) => b.status === 'pending')

    // Get confirmed bookings
    const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed')

    // Get today's schedule
    const today = new Date().toISOString().split('T')[0]
    const todayBookings = confirmedBookings.filter((b) => b.date.split('T')[0] === today)

    // Get recent reviews
    const reviews = db.getReviewsByInstructor(session.userId)
    const recentReviews = reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

    // Get unread messages count
    const conversations = db.getConversationsByUser(session.userId)
    const unreadMessagesCount = conversations.reduce((sum, conv) => {
      return sum + conv.unreadCountInstructor
    }, 0)

    // Calculate earnings (20% commission)
    const completedBookings = allBookings.filter((b) => b.status === 'completed')
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice * 0.8, 0) // 80% after 20% commission

    // Get notifications
    const notifications = db.getNotifications(session.userId)
    const unreadNotifications = notifications.filter((n) => !n.isRead)

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

    return NextResponse.json({
      instructor: session,
      dashboard: {
        pendingBookingsCount: pendingBookings.length,
        pendingBookings: pendingBookings.map(enrichBooking).slice(0, 5),
        confirmedBookingsCount: confirmedBookings.length,
        confirmedBookings: confirmedBookings.map(enrichBooking).slice(0, 10),
        todaySchedule: todayBookings.map(enrichBooking),
        recentReviews,
        averageRating: db.getInstructorProfile(session.userId)?.rating || 0,
        reviewCount: reviews.length,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        unreadMessagesCount,
        notifications: unreadNotifications.slice(0, 10),
        unreadNotificationCount: unreadNotifications.length,
      },
    })
  } catch (error: any) {
    console.error('Error fetching instructor dashboard:', error)

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
      { error: 'Failed to fetch dashboard' },
      { status: 500 }
    )
  }
}
