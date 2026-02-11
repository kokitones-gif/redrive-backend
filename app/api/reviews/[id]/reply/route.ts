import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireRole } from '@/lib/auth/session'

/**
 * POST /api/reviews/:id/reply
 * Reply to a review (instructor only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('instructor')

    await db.init()

    const { id } = await params

    const review = db.getReviewById(id)
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Verify instructor is the one being reviewed
    if (session.userId !== review.instructorId) {
      return NextResponse.json(
        { error: 'Not authorized to reply to this review' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reply } = body

    if (!reply || typeof reply !== 'string' || reply.trim() === '') {
      return NextResponse.json(
        { error: 'Reply content is required' },
        { status: 400 }
      )
    }

    // Add reply to review
    const updatedReview = db.addReplyToReview(id, reply.trim())

    // Create notification for student
    db.createNotification({
      userId: review.studentId,
      type: 'review',
      title: 'Instructor Replied to Your Review',
      message: `${session.name} replied to your review`,
      isRead: false,
      data: { reviewId: id },
    })

    return NextResponse.json({
      message: 'Reply added successfully',
      review: updatedReview,
    })
  } catch (error: any) {
    console.error('Error adding review reply:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (error.message.includes('Not authorized')) {
      return NextResponse.json(
        { error: 'Instructors only can reply to reviews' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add reply' },
      { status: 500 }
    )
  }
}
