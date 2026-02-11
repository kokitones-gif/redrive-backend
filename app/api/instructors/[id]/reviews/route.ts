import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'

/**
 * GET /api/instructors/:id/reviews
 * Get paginated reviews for an instructor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.init()

    const { id } = await params
    const searchParams = request.nextUrl.searchParams

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Verify instructor exists
    const instructor = db.getInstructorById(id)
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    // Get all reviews
    const allReviews = db.getReviewsByInstructor(id)

    // Sort by date descending
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Paginate
    const total = allReviews.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const reviews = allReviews.slice(start, start + limit)

    return NextResponse.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      instructorId: id,
      averageRating: instructor.profile.rating,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
