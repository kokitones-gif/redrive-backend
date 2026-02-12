import { NextRequest, NextResponse } from 'next/server'
import { getBookingsByInstructor, getReviewsByInstructor, getConversationsByUser, getInstructorProfile, getUserById } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireRole('instructor')
    const allBookings = await getBookingsByInstructor(session.userId)

    const pendingBookings = allBookings.filter((b) => b.status === 'pending')
    const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed')

    const today = new Date().toISOString().split('T')[0]
    const todayBookings = confirmedBookings.filter((b) => b.date.split('T')[0] === today)

    const reviews = await getReviewsByInstructor(session.userId)
    const recentReviews = reviews.slice(0, 5)

    const conversations = await getConversationsByUser(session.userId)
    const unreadMessagesCount = conversations.reduce((sum, conv) => sum + conv.unread_count_instructor, 0)

    const completedBookings = allBookings.filter((b) => b.status === 'completed')
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.total_price || 0) * 0.8, 0)

    const profile = await getInstructorProfile(session.userId)

    const enrichBooking = async (booking: any) => {
      const student = await getUserById(booking.student_id)
      return {
        ...booking,
        student: student ? { id: student.id, name: student.name, avatar: student.avatar } : null,
      }
    }

    return NextResponse.json({
      instructor: session,
      dashboard: {
        pendingBookingsCount: pendingBookings.length,
        pendingBookings: await Promise.all(pendingBookings.slice(0, 5).map(enrichBooking)),
        confirmedBookingsCount: confirmedBookings.length,
        confirmedBookings: await Promise.all(confirmedBookings.slice(0, 10).map(enrichBooking)),
        todaySchedule: await Promise.all(todayBookings.map(enrichBooking)),
        recentReviews,
        averageRating: profile?.rating || 0,
        reviewCount: reviews.length,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        unreadMessagesCount,
      },
    })
  } catch (error: any) {
    console.error('Error fetching instructor dashboard:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
