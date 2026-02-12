import { NextRequest, NextResponse } from 'next/server'
import { getAllInstructors, getCoursePricing } from '@/lib/db/supabase-db'

/**
 * GET /api/instructors
 * List instructors with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const area = searchParams.get('area')
    const specialty = searchParams.get('specialty') || undefined
    const transmissionType = searchParams.get('transmissionType')
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const sort = searchParams.get('sort') || 'rating'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    let instructors = await getAllInstructors({
      specialty,
      minRating,
    })

    if (transmissionType) {
      instructors = instructors.filter((instr) =>
        instr.profile.transmission_types.includes(transmissionType)
      )
    }

    if (area) {
      instructors = instructors.filter((instr) =>
        instr.profile.designated_areas.includes(area) ||
        instr.profile.service_areas.includes(area)
      )
    }

    if (maxPrice) {
      const pricingPromises = instructors.map(async (instr) => {
        const pricing = await getCoursePricing(instr.id)
        if (pricing.length === 0) return true
        const minPrice = Math.min(...pricing.map((c) => c.price))
        return minPrice <= maxPrice
      })
      const priceResults = await Promise.all(pricingPromises)
      instructors = instructors.filter((_, i) => priceResults[i])
    }

    if (sort === 'rating') {
      instructors.sort((a, b) => b.profile.rating - a.profile.rating)
    } else if (sort === 'experience') {
      instructors.sort((a, b) => b.profile.experience - a.profile.experience)
    }

    const total = instructors.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedInstructors = instructors.slice(start, start + limit)

    const results = await Promise.all(
      paginatedInstructors.map(async (instr) => {
        const { password_hash, ...safeUser } = instr
        const coursePricing = await getCoursePricing(instr.id)
        return { ...safeUser, coursePricing }
      })
    )

    return NextResponse.json({
      data: results,
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    console.error('Error fetching instructors:', error)
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 })
  }
}
