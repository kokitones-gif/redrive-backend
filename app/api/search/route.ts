import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'

/**
 * GET /api/search
 * Advanced search for instructors with full-text search
 */
export async function GET(request: NextRequest) {
  try {
    await db.init()

    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const q = searchParams.get('q')?.toLowerCase() || ''
    const area = searchParams.get('area')
    const date = searchParams.get('date')
    const specialty = searchParams.get('specialty')
    const transmission = searchParams.get('transmission')
    const priceRange = searchParams.get('priceRange')
    const sort = searchParams.get('sort') || 'rating'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get all instructors
    let instructors = db.getAllInstructors()

    // Full-text search on name and introduction
    if (q) {
      instructors = instructors.filter((instr) => {
        const name = instr.name.toLowerCase()
        const intro = instr.profile.introduction.toLowerCase()
        return name.includes(q) || intro.includes(q)
      })
    }

    // Filter by specialty
    if (specialty) {
      instructors = instructors.filter((instr) =>
        instr.profile.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()))
      )
    }

    // Filter by transmission type
    if (transmission) {
      instructors = instructors.filter((instr) =>
        instr.profile.transmissionTypes.includes(transmission as 'AT' | 'MT')
      )
    }

    // Filter by area
    if (area) {
      instructors = instructors.filter((instr) =>
        instr.profile.designatedAreas.includes(area) ||
        instr.profile.serviceAreas.includes(area)
      )
    }

    // Filter by availability on date
    if (date) {
      instructors = instructors.filter((instr) => {
        const slots = db.getAvailability(instr.id, date, date)
        return slots.some((s) => s.isAvailable)
      })
    }

    // Filter by price range
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number)
      instructors = instructors.filter((instr) => {
        const pricing = db.getCoursePricing(instr.id)
        if (pricing.length === 0) return true
        const prices = pricing.map((c) => c.price)
        const minCoursePrice = Math.min(...prices)
        const maxCoursePrice = Math.max(...prices)

        if (maxPrice) {
          return minCoursePrice <= maxPrice && maxCoursePrice >= minPrice
        }
        return minCoursePrice >= minPrice
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
      query: q,
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
  } catch (error) {
    console.error('Error searching instructors:', error)
    return NextResponse.json(
      { error: 'Failed to search instructors' },
      { status: 500 }
    )
  }
}
