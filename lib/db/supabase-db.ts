/**
 * Database Layer - Supabase-backed database for Re:Drive
 * Replaces the in-memory Map-based database
 */

import { supabase } from '@/lib/supabase'

// ============= TYPES =============
export interface DbUser {
  id: string
  email: string
  password_hash: string
  name: string
  role: 'student' | 'instructor'
  phone?: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface DbInstructorProfile {
  user_id: string
  experience: number
  introduction: string
  car_type: string
  transmission_types: string[]
  specialties: string[]
  badges: string[]
  gender: string
  age_group: string
  teaching_style: string[]
  has_instructor_license: boolean
  service_areas: string
  designated_areas: string[]
  travel_areas: string[]
  travel_fee: number
  vehicle_fee: number
  is_approved: boolean
  rating: number
  review_count: number
}

export interface DbBooking {
  id: string
  student_id: string
  instructor_id: string
  date: string
  time_slot: string
  location: string
  course_name?: string
  status: string
  use_instructor_vehicle: boolean
  total_price?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface DbReview {
  id: string
  student_id: string
  instructor_id: string
  booking_id?: string
  rating: number
  comment?: string
  course_name?: string
  reply?: string
  reply_date?: string
  created_at: string
}

export interface DbConversation {
  id: string
  student_id: string
  instructor_id: string
  last_message?: string
  last_message_time?: string
  unread_count_student: number
  unread_count_instructor: number
  created_at: string
  updated_at: string
}

export interface DbMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface DbCoursePricing {
  id: string
  instructor_id: string
  name: string
  hours: number
  sessions: number
  price: number
  description?: string
}

export interface DbTimeSlot {
  id: string
  instructor_id: string
  date: string
  period: string
  is_available: boolean
  capacity: number
}

// ============= USER OPERATIONS =============

export async function createUser(data: {
  email: string
  password_hash: string
  name: string
  role: string
  phone?: string
  avatar?: string
}): Promise<DbUser> {
  const { data: user, error } = await supabase
    .from('users')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to create user: ${error.message}`)
  return user
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single()

  if (error) return null
  return data
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

// ============= INSTRUCTOR OPERATIONS =============

export async function getInstructorProfile(userId: string): Promise<DbInstructorProfile | null> {
  const { data, error } = await supabase
    .from('instructor_profiles')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

export async function getAllInstructors(filters?: {
  specialty?: string
  gender?: string
  minRating?: number
}): Promise<(DbUser & { profile: DbInstructorProfile })[]> {
  let query = supabase
    .from('users')
    .select(`
      *,
      profile:instructor_profiles(*)
    `)
    .eq('role', 'instructor')

  if (filters?.gender) {
    query = query.eq('instructor_profiles.gender', filters.gender)
  }
  if (filters?.minRating) {
    query = query.gte('instructor_profiles.rating', filters.minRating)
  }

  const { data, error } = await query

  if (error) return []

  return (data || [])
    .filter((u: any) => {
      if (!u.profile) return false
      if (Array.isArray(u.profile)) return u.profile.length > 0
      return true // single object (1-to-1 relation)
    })
    .map((u: any) => ({
      ...u,
      profile: Array.isArray(u.profile) ? u.profile[0] : u.profile,
    }))
    .filter((u: any) => {
      if (filters?.specialty) {
        return u.profile.specialties?.includes(filters.specialty)
      }
      return true
    })
}

export async function getInstructorById(id: string): Promise<(DbUser & { profile: DbInstructorProfile }) | null> {
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      profile:instructor_profiles(*)
    `)
    .eq('id', id)
    .eq('role', 'instructor')
    .single()

  if (error || !data) return null

  return {
    ...data,
    profile: Array.isArray(data.profile) ? data.profile[0] : data.profile,
  }
}

// ============= BOOKING OPERATIONS =============

export async function createBooking(data: Omit<DbBooking, 'id' | 'created_at' | 'updated_at'>): Promise<DbBooking> {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to create booking: ${error.message}`)
  return booking
}

export async function getBookingById(id: string): Promise<DbBooking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select()
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getBookingsByStudent(studentId: string): Promise<DbBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select()
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function getBookingsByInstructor(instructorId: string): Promise<DbBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select()
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function updateBookingStatus(id: string, status: string): Promise<DbBooking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update booking: ${error.message}`)
  return data
}

// ============= REVIEW OPERATIONS =============

export async function createReview(data: Omit<DbReview, 'id' | 'created_at'>): Promise<DbReview> {
  const { data: review, error } = await supabase
    .from('reviews')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(`Failed to create review: ${error.message}`)
  return review
}

export async function getReviewsByInstructor(instructorId: string): Promise<(DbReview & { student: DbUser | null })[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      student:users!reviews_student_id_fkey(id, name, avatar)
    `)
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function addReplyToReview(reviewId: string, reply: string): Promise<DbReview> {
  const { data, error } = await supabase
    .from('reviews')
    .update({ reply, reply_date: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) throw new Error(`Failed to add reply: ${error.message}`)
  return data
}

// ============= MESSAGE OPERATIONS =============

export async function getOrCreateConversation(studentId: string, instructorId: string): Promise<DbConversation> {
  // Try to find existing
  const { data: existing } = await supabase
    .from('conversations')
    .select()
    .eq('student_id', studentId)
    .eq('instructor_id', instructorId)
    .single()

  if (existing) return existing

  // Create new
  const { data, error } = await supabase
    .from('conversations')
    .insert({ student_id: studentId, instructor_id: instructorId })
    .select()
    .single()

  if (error) throw new Error(`Failed to create conversation: ${error.message}`)
  return data
}

export async function getConversationsByUser(userId: string): Promise<DbConversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select()
    .or(`student_id.eq.${userId},instructor_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) return []
  return data || []
}

export async function addMessage(conversationId: string, senderId: string, content: string): Promise<DbMessage> {
  const { data: message, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single()

  if (error) throw new Error(`Failed to send message: ${error.message}`)

  // Update conversation
  await supabase
    .from('conversations')
    .update({
      last_message: content,
      last_message_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  return message
}

export async function getMessages(conversationId: string): Promise<DbMessage[]> {
  const { data, error } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) return []
  return data || []
}

// ============= TIME SLOT OPERATIONS =============

export async function getAvailability(
  instructorId: string,
  startDate: string,
  endDate: string
): Promise<DbTimeSlot[]> {
  const { data, error } = await supabase
    .from('time_slots')
    .select()
    .eq('instructor_id', instructorId)
    .gte('date', startDate)
    .lte('date', endDate)

  if (error) return []
  return data || []
}

// ============= ADDITIONAL REVIEW OPERATIONS =============

export async function getReviewById(id: string): Promise<DbReview | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select()
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getReviewsByStudent(studentId: string): Promise<DbReview[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select()
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}

// ============= ADDITIONAL CONVERSATION OPERATIONS =============

export async function getConversationById(id: string): Promise<DbConversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select()
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)

  const conversation = await getConversationById(conversationId)
  if (!conversation) return

  if (userId === conversation.student_id) {
    await supabase
      .from('conversations')
      .update({ unread_count_student: 0 })
      .eq('id', conversationId)
  } else {
    await supabase
      .from('conversations')
      .update({ unread_count_instructor: 0 })
      .eq('id', conversationId)
  }
}

// ============= ADDITIONAL TIME SLOT OPERATIONS =============

export async function updateAvailability(
  instructorId: string,
  date: string,
  period: string,
  isAvailable: boolean
): Promise<DbTimeSlot> {
  const { data, error } = await supabase
    .from('time_slots')
    .upsert(
      {
        instructor_id: instructorId,
        date,
        period,
        is_available: isAvailable,
        capacity: 2,
      },
      { onConflict: 'instructor_id,date,period' }
    )
    .select()
    .single()

  if (error) throw new Error(`Failed to update availability: ${error.message}`)
  return data
}

// ============= INSTRUCTOR PROFILE UPDATE =============

export async function updateInstructorProfile(
  userId: string,
  data: Partial<DbInstructorProfile>
): Promise<DbInstructorProfile> {
  const { data: profile, error } = await supabase
    .from('instructor_profiles')
    .update(data)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw new Error(`Failed to update instructor profile: ${error.message}`)
  return profile
}

// ============= COURSE PRICING =============

export async function getCoursePricing(instructorId: string): Promise<DbCoursePricing[]> {
  const { data, error } = await supabase
    .from('course_pricing')
    .select()
    .eq('instructor_id', instructorId)

  if (error) return []
  return data || []
}

// ============= STUDENT PROFILES =============

export interface DbStudentProfile {
  id: string
  user_id: string
  last_name: string
  first_name: string
  last_name_kana: string
  first_name_kana: string
  birthdate: string | null
  phone: string
  postal_code: string
  prefecture: string
  city: string
  address: string
  building: string
  license_number: string
  license_type: string
  transmission_type: string
  license_issue_date: string | null
  license_expiry_date: string | null
  created_at: string
  updated_at: string
}

export async function getStudentProfile(userId: string): Promise<DbStudentProfile | null> {
  const { data, error } = await supabase
    .from('student_profiles')
    .select()
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

export async function upsertStudentProfile(
  userId: string,
  profileData: Partial<DbStudentProfile>
): Promise<DbStudentProfile> {
  const { data, error } = await supabase
    .from('student_profiles')
    .upsert(
      { ...profileData, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw new Error(`Failed to upsert student profile: ${error.message}`)
  return data
}
