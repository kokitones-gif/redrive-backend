import { NextRequest, NextResponse } from 'next/server'
import { getInstructorById, getReviewsByInstructor } from '@/lib/db/supabase-db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const instructor = await getInstructorById(id)
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 })
    }

    const allReviews = await getReviewsByInstructor(id)
    const total = allReviews.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const reviews = allReviews.slice(start, start + limit)

    return NextResponse.json({
      data: reviews,
      pagination: { page, limit, total, totalPages },
      instructorId: id,
      averageRating: instructor.profile.rating,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
