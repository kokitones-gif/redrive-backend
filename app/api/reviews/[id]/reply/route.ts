import { NextRequest, NextResponse } from 'next/server'
import { getReviewById, addReplyToReview } from '@/lib/db/supabase-db'
import { requireRole } from '@/lib/auth/session'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRole('instructor')
    const { id } = await params

    const review = await getReviewById(id)
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    if (session.userId !== review.instructor_id) {
      return NextResponse.json({ error: 'Not authorized to reply to this review' }, { status: 403 })
    }

    const body = await request.json()
    const { reply } = body

    if (!reply || typeof reply !== 'string' || reply.trim() === '') {
      return NextResponse.json({ error: 'Reply content is required' }, { status: 400 })
    }

    const updatedReview = await addReplyToReview(id, reply.trim())
    return NextResponse.json({ message: 'Reply added successfully', review: updatedReview })
  } catch (error: any) {
    console.error('Error adding review reply:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error.message?.includes('Not authorized')) {
      return NextResponse.json({ error: 'Instructors only can reply to reviews' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
}
