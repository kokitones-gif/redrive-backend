import { NextRequest, NextResponse } from 'next/server'
import { getAllInstructors, getCoursePricing, getAvailability } from '@/lib/db/supabase-db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')?.toLowerCase() || ''
    const area = searchParams.get('area')
    const date = searchParams.get('date')
    const specialty = searchParams.get('specialty')
    const transmission = searchParams.get('transmission')
    const priceRange = searchParams.get('priceRange')
    const sort = searchParams.get('sort') || 'rating'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    let instructors = await getAllInstructors()

    if (q) {
      instructors = instructors.filter((instr) => {
        const name = instr.name.toLowerCase()
        const intro = instr.profile.introduction.toLowerCase()
        return name.includes(q) || intro.includes(q)
      })
    }

    if (specialty) {
      instructors = instructors.filter((instr) =>
        instr.profile.specialties.some((s) => s.toLowerCase().includes(specialty.toLowerCase()))
      )
    }

    if (transmission) {
      instructors = instructors.filter((instr) =>
        instr.profile.transmission_types.includes(transmission)
      )
    }

    if (area) {
      instructors = instructors.filter((instr) =>
        instr.profile.designated_areas.includes(area) ||
        instr.profile.service_areas.includes(area)
      )
    }

    if (date) {
      const checks = await Promise.all(
        instructors.map(async (instr) => {
          const slots = await getAvailability(instr.id, date, date)
          return slots.some((s) => s.is_available)
        })
      )
      instructors = instructors.filter((_, i) => checks[i])
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number)
      const checks = await Promise.all(
        instructors.map(async (instr) => {
          const pricing = await getCoursePricing(instr.id)
          if (pricing.length === 0) return true
          const prices = pricing.map((c) => c.price)
          const minCoursePrice = Math.min(...prices)
          const maxCoursePrice = Math.max(...prices)
          if (maxPrice) return minCoursePrice <= maxPrice && maxCoursePrice >= minPrice
          return minCoursePrice >= minPrice
        })
      )
      instructors = instructors.filter((_, i) => checks[i])
    }

    instructors.sort((a, b) => {
      if (sort === 'rating') return b.profile.rating - a.profile.rating
      if (sort === 'experience') return b.profile.experience - a.profile.experience
      return 0
    })

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
      query: q,
      data: results,
      pagination: { page, limit, total, totalPages },
    })
  } catch (error) {
    console.error('Error searching instructors:', error)
    return NextResponse.json({ error: 'Failed to search instructors' }, { status: 500 })
  }
}
