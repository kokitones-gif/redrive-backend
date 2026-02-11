import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { getSession } from '@/lib/auth/session'

/**
 * GET /api/instructors
 * List instructors with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Initialize database if needed
    await db.init()

    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const area = searchParams.get('area')
    const specialty = searchParams.get('specialty')
    const transmissionType = searchParams.get('transmissionType')
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const sort = searchParams.get('sort') || 'rating' // rating|price|experience
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get all instructors with basic filters
    let instructors = db.getAllInstructors({
      specialty,
      minRating,
    })

    // Apply additional filters
    if (transmissionType) {
      instructors = instructors.filter((instr) =>
        instr.profile.transmissionTypes.includes(transmissionType as 'AT' | 'MT')
      )
    }

    if (area) {
      instructors = instructors.filter((instr) =>
        instr.profile.designatedAreas.includes(area) ||
        instr.profile.serviceAreas.includes(area)
      )
    }

    if (maxPrice) {
      const coursePricing = db.getCoursePricing(instructors[0]?.id || '')
      const minPriceOption = coursePricing.length > 0 ? Math.min(...coursePricing.map((c) => c.price)) : 0
      instructors = instructors.filter((instr) => {
        const pricing = db.getCoursePricing(instr.id)
        if (pricing.length === 0) return true
        const minPrice = Math.min(...pricing.map((c) => c.price))
        return minPrice <= maxPrice
      })
    }

    // Sort
    instructors.sort((a, b) => {
      if (sort === 'rating') {
        return b.profile.rating - a.profile.rating
      } else if (sort === 'price') {
        const priceA = db.getCoursePricing(a.id)[0]?.price || 0
        const priceB = db.getCoursePricing(b.id)[0]?.price || 0
        return priceA - priceB
      } else if (sort === 'experience') {
        return b.profile.experience - a.profile.experience
      }
      return 0
    })

    // Paginate
    const total = instructors.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedInstructors = instructors.slice(start, start + limit)

    // Enrich with course pricing, remove sensitive data
    const results = paginatedInstructors.map((instr) => {
      const { passwordHash, ...safeUser } = instr
      return {
        ...safeUser,
        coursePricing: db.getCoursePricing(instr.id),
      }
    })

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching instructors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}
