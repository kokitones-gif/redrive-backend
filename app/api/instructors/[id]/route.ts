import { NextRequest, NextResponse } from 'next/server'
import { getInstructorById, getCoursePricing, getReviewsByInstructor } from '@/lib/db/supabase-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const instructor = await getInstructorById(id)
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }
    const coursePricing = await getCoursePricing(id)
    const reviews = await getReviewsByInstructor(id)
    const { password_hash, ...safeInstructor } = instructor
    return NextResponse.json({
      instructor: safeInstructor,
      coursePricing,
      reviews,
      reviewCount: reviews.length,
      averageRating: instructor.profile.rating,
    })
  } catch (error) {
    console.error('Error fetching instructor:', error)
    return NextResponse.json({ error: 'Failed to fetch instructor' }, { status: 500 })
  }
}
