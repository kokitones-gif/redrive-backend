import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'

/**
 * GET /api/instructors/:id
 * Get instructor detail with reviews and pricing
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await db.init()

    const { id } = await params

    // Get instructor with profile
    const instructor = db.getInstructorById(id)
    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    // Get course pricing
    const coursePricing = db.getCoursePricing(id)

    // Get reviews
    const reviews = db.getReviewsByInstructor(id)

    // Remove sensitive data
    const { passwordHash, ...safeInstructor } = instructor

    return NextResponse.json({
      instructor: safeInstructor,
      coursePricing,
      reviews,
      reviewCount: reviews.length,
      averageRating: instructor.profile.rating,
    })
  } catch (error) {
    console.error('Error fetching instructor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    )
  }
}
