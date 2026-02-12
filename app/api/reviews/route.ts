import { NextRequest, NextResponse } from 'next/server'
import { getBookingById, getInstructorById, getReviewsByStudent, getReviewsByInstructor, createReview, updateInstructorProfile } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('student')
    const body = await request.json()
    const { bookingId, instructorId, rating, comment, courseName } = body

    if (!bookingId || !instructorId || !rating) {
      return NextResponse.json({ error: 'Missing required fields: bookingId, instructorId, rating' }, { status: 400 })
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 })
    }

    const booking = await getBookingById(bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.student_id !== session.userId) {
      return NextResponse.json({ error: 'Not authorized to review this booking' }, { status: 403 })
    }

    if (booking.instructor_id !== instructorId) {
      return NextResponse.json({ error: 'Instructor ID does not match booking' }, { status: 400 })
    }

    const instructor = await getInstructorById(instructorId)
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const existingReviews = await getReviewsByStudent(session.userId)
    if (existingReviews.some((r) => r.booking_id === bookingId)) {
      return NextResponse.json({ error: 'Review already exists for this booking' }, { status: 400 })
    }

    const review = await createReview({
      booking_id: bookingId,
      student_id: session.userId,
      instructor_id: instructorId,
      rating,
      comment: comment || '',
      course_name: courseName,
    })

    const allReviews = await getReviewsByInstructor(instructorId)
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await updateInstructorProfile(instructorId, {
      rating: Math.round(avgRating * 10) / 10,
      review_count: allReviews.length,
    })

    return NextResponse.json({ message: 'Review created successfully', review }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Students only can create reviews' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
