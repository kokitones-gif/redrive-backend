import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * POST /api/reviews
 * Create a review (student only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireRole('student')

    await db.init()

    const body = await request.json()
    const { bookingId, instructorId, rating, comment, tags } = body

    // Validate required fields
    if (!bookingId || !instructorId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, instructorId, rating' },
        { status: 400 }
      )
    }

    // Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify booking exists and belongs to student
    const booking = db.getBookingById(bookingId)
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.studentId !== session.userId) {
      return NextResponse.json(
        { error: 'Not authorized to review this booking' },
        { status: 403 }
      )
    }

    if (booking.instructorId !== instructorId) {
      return NextResponse.json(
        { error: 'Instructor ID does not match booking' },
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

    // Check if review already exists for this booking
    const existingReviews = db.getReviewsByStudent(session.userId)
    if (existingReviews.some((r) => r.bookingId === bookingId)) {
      return NextResponse.json(
        { error: 'Review already exists for this booking' },
        { status: 400 }
      )
    }

    // Create review
    const review = db.createReview({
      bookingId,
      studentId: session.userId,
      instructorId,
      rating,
      comment: comment || '',
      tags: Array.isArray(tags) ? tags : [],
    })

    // Update instructor rating
    const allReviews = db.getReviewsByInstructor(instructorId)
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    db.updateInstructorProfile(instructorId, {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      reviewCount: allReviews.length,
    })

    // Create notification for instructor
    db.createNotification({
      userId: instructorId,
      type: 'review',
      title: 'New Review Received',
      message: `You received a ${rating}-star review from ${session.name}`,
      isRead: false,
      data: { reviewId: review.id, bookingId },
    })

    return NextResponse.json({
      message: 'Review created successfully',
      review,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating review:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Students only can create reviews' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
