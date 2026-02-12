/**
 * GET /api/mypage/settings - Get student profile settings
 * PUT /api/mypage/settings - Update student profile settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSession, createSession } from '@/lib/auth/session'
import { getUserById, getStudentProfile, upsertStudentProfile } from '@/lib/db/supabase-db'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await getStudentProfile(session.userId)

    return NextResponse.json({
      user: {
        name: session.name,
        email: session.email,
        role: session.role,
      },
      profile: profile || null,
    })
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const {
      lastName, firstName, lastNameKana, firstNameKana,
      birthdate, email, phone, postalCode, prefecture,
      city, address, building,
      licenseNumber, licenseType, transmissionType,
      licenseIssueDate, licenseExpiryDate,
    } = body

    // Update user name and email in users table
    const newName = `${lastName} ${firstName}`.trim()
    const updateUserData: Record<string, string> = { name: newName, updated_at: new Date().toISOString() }
    if (email) updateUserData.email = email
    if (phone) updateUserData.phone = phone

    const { error: userError } = await supabase
      .from('users')
      .update(updateUserData)
      .eq('id', session.userId)

    if (userError) {
      console.error('User update error:', userError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    // Upsert student profile
    const profileData = {
      last_name: lastName || '',
      first_name: firstName || '',
      last_name_kana: lastNameKana || '',
      first_name_kana: firstNameKana || '',
      birthdate: birthdate || null,
      phone: phone || '',
      postal_code: postalCode || '',
      prefecture: prefecture || '',
      city: city || '',
      address: address || '',
      building: building || '',
      license_number: licenseNumber || '',
      license_type: licenseType || '',
      transmission_type: transmissionType || 'AT',
      license_issue_date: licenseIssueDate || null,
      license_expiry_date: licenseExpiryDate || null,
    }

    const profile = await upsertStudentProfile(session.userId, profileData)

    // Update session cookie with new name/email
    await createSession({
      userId: session.userId,
      email: email || session.email,
      name: newName || session.name,
      role: session.role,
      avatar: session.avatar,
    })

    return NextResponse.json({
      message: 'Settings updated successfully',
      profile,
    })
  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
