/**
 * Database Layer - In-memory JSON-based database for Re:Drive
 * Uses Maps for data storage with JSON serialization
 */

import { randomUUID } from "crypto"
import type {
  User,
  StudentProfile,
  InstructorProfile,
  CoursePricing,
  TimeSlot,
  Booking,
  Review,
  Conversation,
  Message,
  Notification,
  InstructorWithProfile,
} from "./schema"

/**
 * Main Database class - Singleton pattern
 * Stores all data in-memory using Maps
 */
class Database {
  private users: Map<string, User> = new Map()
  private studentProfiles: Map<string, StudentProfile> = new Map()
  private instructorProfiles: Map<string, InstructorProfile> = new Map()
  private coursePricing: Map<string, CoursePricing[]> = new Map()
  private timeSlots: Map<string, TimeSlot[]> = new Map()
  private bookings: Map<string, Booking> = new Map()
  private reviews: Map<string, Review> = new Map()
  private conversations: Map<string, Conversation> = new Map()
  private messages: Map<string, Message[]> = new Map()
  private notifications: Map<string, Notification[]> = new Map()
  private userEmails: Map<string, string> = new Map() // email -> userId index
  private initialized: boolean = false

  /**
   * Initialize the database - loads seed data
   */
  async init(): Promise<void> {
    if (this.initialized) return

    // Import seed function to populate with data
    const { seed } = await import("./seed")
    await seed(this)

    this.initialized = true
  }

  /**
   * ========== USER OPERATIONS ==========
   */

  /**
   * Create a new user
   */
  createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = randomUUID()
    const now = new Date().toISOString()

    const user: User = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.users.set(id, user)
    this.userEmails.set(data.email, id)

    return user
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): User | null {
    return this.users.get(id) || null
  }

  /**
   * Get user by email
   */
  getUserByEmail(email: string): User | null {
    const userId = this.userEmails.get(email)
    return userId ? this.users.get(userId) || null : null
  }

  /**
   * Update user
   */
  updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt">>): User {
    const user = this.users.get(id)
    if (!user) throw new Error(`User ${id} not found`)

    const updated: User = {
      ...user,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.users.set(id, updated)
    return updated
  }

  /**
   * ========== INSTRUCTOR PROFILE OPERATIONS ==========
   */

  /**
   * Get instructor profile by user ID
   */
  getInstructorProfile(userId: string): InstructorProfile | null {
    return this.instructorProfiles.get(userId) || null
  }

  /**
   * Create or update instructor profile
   */
  updateInstructorProfile(userId: string, data: Partial<InstructorProfile>): InstructorProfile {
    const existing = this.instructorProfiles.get(userId) || {
      userId,
      experience: 0,
      introduction: "",
      carType: "",
      transmissionTypes: [],
      specialties: [],
      badges: [],
      gender: "male" as const,
      ageGroup: "30代" as const,
      teachingStyle: [],
      hasInstructorLicense: false,
      serviceAreas: "",
      designatedAreas: [],
      travelAreas: [],
      travelFee: 0,
      vehicleFee: 0,
      isApproved: true,
      rating: 0,
      reviewCount: 0,
    }

    const updated: InstructorProfile = {
      ...existing,
      ...data,
      userId, // Ensure userId is never changed
    }

    this.instructorProfiles.set(userId, updated)
    return updated
  }

  /**
   * Get all instructors with optional filters
   */
  getAllInstructors(filters?: {
    specialty?: string
    gender?: "male" | "female"
    minRating?: number
  }): InstructorWithProfile[] {
    const instructors: InstructorWithProfile[] = []

    this.instructorProfiles.forEach((profile) => {
      const user = this.users.get(profile.userId)
      if (!user || user.role !== "instructor") return

      // Apply filters
      if (filters?.specialty && !profile.specialties.includes(filters.specialty)) return
      if (filters?.gender && profile.gender !== filters.gender) return
      if (filters?.minRating && profile.rating < filters.minRating) return

      instructors.push({
        ...user,
        profile,
      })
    })

    return instructors
  }

  /**
   * Get instructor by ID
   */
  getInstructorById(id: string): InstructorWithProfile | null {
    const user = this.users.get(id)
    if (!user || user.role !== "instructor") return null

    const profile = this.instructorProfiles.get(id)
    if (!profile) return null

    return {
      ...user,
      profile,
    }
  }

  /**
   * ========== STUDENT PROFILE OPERATIONS ==========
   */

  /**
   * Get student profile by user ID
   */
  getStudentProfile(userId: string): StudentProfile | null {
    return this.studentProfiles.get(userId) || null
  }

  /**
   * Create or update student profile
   */
  updateStudentProfile(userId: string, data: Partial<StudentProfile>): StudentProfile {
    const existing = this.studentProfiles.get(userId) || {
      userId,
    }

    const updated: StudentProfile = {
      ...existing,
      ...data,
      userId,
    }

    this.studentProfiles.set(userId, updated)
    return updated
  }

  /**
   * ========== BOOKING OPERATIONS ==========
   */

  /**
   * Create a new booking
   */
  createBooking(data: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
    const id = randomUUID()
    const now = new Date().toISOString()

    const booking: Booking = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    }

    this.bookings.set(id, booking)
    return booking
  }

  /**
   * Get booking by ID
   */
  getBookingById(id: string): Booking | null {
    return this.bookings.get(id) || null
  }

  /**
   * Get all bookings for a student
   */
  getBookingsByStudent(studentId: string): Booking[] {
    const results: Booking[] = []
    this.bookings.forEach((booking) => {
      if (booking.studentId === studentId) {
        results.push(booking)
      }
    })
    return results
  }

  /**
   * Get all bookings for an instructor
   */
  getBookingsByInstructor(instructorId: string): Booking[] {
    const results: Booking[] = []
    this.bookings.forEach((booking) => {
      if (booking.instructorId === instructorId) {
        results.push(booking)
      }
    })
    return results
  }

  /**
   * Update booking status
   */
  updateBookingStatus(id: string, status: Booking["status"]): Booking {
    const booking = this.bookings.get(id)
    if (!booking) throw new Error(`Booking ${id} not found`)

    const updated: Booking = {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
    }

    this.bookings.set(id, updated)
    return updated
  }

  /**
   * Update entire booking
   */
  updateBooking(id: string, data: Partial<Omit<Booking, "id" | "createdAt">>): Booking {
    const booking = this.bookings.get(id)
    if (!booking) throw new Error(`Booking ${id} not found`)

    const updated: Booking = {
      ...booking,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.bookings.set(id, updated)
    return updated
  }

  /**
   * ========== REVIEW OPERATIONS ==========
   */

  /**
   * Create a new review
   */
  createReview(data: Omit<Review, "id" | "createdAt">): Review {
    const id = randomUUID()
    const now = new Date().toISOString()

    const review: Review = {
      ...data,
      id,
      createdAt: now,
    }

    this.reviews.set(id, review)
    return review
  }

  /**
   * Get review by ID
   */
  getReviewById(id: string): Review | null {
    return this.reviews.get(id) || null
  }

  /**
   * Get all reviews for an instructor
   */
  getReviewsByInstructor(instructorId: string): Review[] {
    const results: Review[] = []
    this.reviews.forEach((review) => {
      if (review.instructorId === instructorId) {
        results.push(review)
      }
    })
    return results
  }

  /**
   * Get reviews by student
   */
  getReviewsByStudent(studentId: string): Review[] {
    const results: Review[] = []
    this.reviews.forEach((review) => {
      if (review.studentId === studentId) {
        results.push(review)
      }
    })
    return results
  }

  /**
   * Add reply to review
   */
  addReplyToReview(reviewId: string, reply: string): Review {
    const review = this.reviews.get(reviewId)
    if (!review) throw new Error(`Review ${reviewId} not found`)

    const updated: Review = {
      ...review,
      reply,
      replyDate: new Date().toISOString(),
    }

    this.reviews.set(reviewId, updated)
    return updated
  }

  /**
   * ========== MESSAGE OPERATIONS ==========
   */

  /**
   * Get or create conversation between student and instructor
   */
  getOrCreateConversation(studentId: string, instructorId: string): Conversation {
    let conversation: Conversation | null = null

    // Find existing conversation
    this.conversations.forEach((conv) => {
      if (conv.studentId === studentId && conv.instructorId === instructorId) {
        conversation = conv
      }
    })

    if (conversation) return conversation

    // Create new conversation
    const id = randomUUID()
    const now = new Date().toISOString()

    const newConversation: Conversation = {
      id,
      studentId,
      instructorId,
      unreadCountStudent: 0,
      unreadCountInstructor: 0,
      createdAt: now,
      updatedAt: now,
    }

    this.conversations.set(id, newConversation)
    this.messages.set(id, [])

    return newConversation
  }

  /**
   * Get conversation by ID
   */
  getConversationById(id: string): Conversation | null {
    return this.conversations.get(id) || null
  }

  /**
   * Get all conversations for a user
   */
  getConversationsByUser(userId: string): Conversation[] {
    const results: Conversation[] = []
    this.conversations.forEach((conv) => {
      if (conv.studentId === userId || conv.instructorId === userId) {
        results.push(conv)
      }
    })
    return results
  }

  /**
   * Add message to conversation
   */
  addMessage(conversationId: string, data: Omit<Message, "id" | "timestamp">): Message {
    const conversation = this.conversations.get(conversationId)
    if (!conversation) throw new Error(`Conversation ${conversationId} not found`)

    const id = randomUUID()
    const timestamp = new Date().toISOString()

    const message: Message = {
      ...data,
      id,
      timestamp,
    }

    const messages = this.messages.get(conversationId) || []
    messages.push(message)
    this.messages.set(conversationId, messages)

    // Update conversation
    conversation.lastMessage = data.content
    conversation.lastMessageTime = timestamp
    conversation.updatedAt = timestamp

    // Update unread count
    if (data.senderId === conversation.studentId) {
      conversation.unreadCountInstructor++
    } else {
      conversation.unreadCountStudent++
    }

    this.conversations.set(conversationId, conversation)

    return message
  }

  /**
   * Get all messages for a conversation
   */
  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || []
  }

  /**
   * Mark messages as read
   */
  markMessagesAsRead(conversationId: string, userId: string): void {
    const messages = this.messages.get(conversationId) || []
    const conversation = this.conversations.get(conversationId)

    if (!conversation) throw new Error(`Conversation ${conversationId} not found`)

    // Mark all messages as read
    messages.forEach((msg) => {
      if (msg.senderId !== userId) {
        msg.isRead = true
      }
    })

    this.messages.set(conversationId, messages)

    // Reset unread count for this user
    if (userId === conversation.studentId) {
      conversation.unreadCountStudent = 0
    } else {
      conversation.unreadCountInstructor = 0
    }

    this.conversations.set(conversationId, conversation)
  }

  /**
   * ========== TIME SLOT OPERATIONS ==========
   */

  /**
   * Get availability for an instructor
   */
  getAvailability(
    instructorId: string,
    startDate: string,
    endDate: string
  ): TimeSlot[] {
    const slots = this.timeSlots.get(instructorId) || []
    return slots.filter((slot) => slot.date >= startDate && slot.date <= endDate)
  }

  /**
   * Update availability
   */
  updateAvailability(
    instructorId: string,
    date: string,
    period: "morning" | "afternoon" | "evening",
    isAvailable: boolean,
    capacity?: number
  ): TimeSlot {
    const slots = this.timeSlots.get(instructorId) || []

    // Find existing slot
    let slot = slots.find((s) => s.date === date && s.period === period)

    if (slot) {
      slot.isAvailable = isAvailable
      if (capacity !== undefined) slot.capacity = capacity
    } else {
      slot = {
        id: randomUUID(),
        instructorId,
        date,
        period,
        isAvailable,
        capacity: capacity || 2,
      }
      slots.push(slot)
    }

    this.timeSlots.set(instructorId, slots)
    return slot
  }

  /**
   * Add time slot
   */
  addTimeSlot(data: Omit<TimeSlot, "id">): TimeSlot {
    const id = randomUUID()
    const slot: TimeSlot = {
      ...data,
      id,
    }

    const slots = this.timeSlots.get(data.instructorId) || []
    slots.push(slot)
    this.timeSlots.set(data.instructorId, slots)

    return slot
  }

  /**
   * ========== COURSE PRICING OPERATIONS ==========
   */

  /**
   * Get course pricing for instructor
   */
  getCoursePricing(instructorId: string): CoursePricing[] {
    return this.coursePricing.get(instructorId) || []
  }

  /**
   * Update course pricing
   */
  updateCoursePricing(instructorId: string, courses: Omit<CoursePricing, "id">[]): CoursePricing[] {
    const result = courses.map((course) => ({
      ...course,
      id: randomUUID(),
    }))

    this.coursePricing.set(instructorId, result)
    return result
  }

  /**
   * Add course pricing
   */
  addCoursePricing(data: Omit<CoursePricing, "id">): CoursePricing {
    const id = randomUUID()
    const course: CoursePricing = {
      ...data,
      id,
    }

    const courses = this.coursePricing.get(data.instructorId) || []
    courses.push(course)
    this.coursePricing.set(data.instructorId, courses)

    return course
  }

  /**
   * ========== NOTIFICATION OPERATIONS ==========
   */

  /**
   * Create notification
   */
  createNotification(data: Omit<Notification, "id" | "createdAt">): Notification {
    const id = randomUUID()
    const now = new Date().toISOString()

    const notification: Notification = {
      ...data,
      id,
      createdAt: now,
    }

    const notifications = this.notifications.get(data.userId) || []
    notifications.push(notification)
    this.notifications.set(data.userId, notifications)

    return notification
  }

  /**
   * Get notifications for user
   */
  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) || []
  }

  /**
   * Mark notification as read
   */
  markNotificationAsRead(userId: string, notificationId: string): Notification {
    const notifications = this.notifications.get(userId) || []
    const notification = notifications.find((n) => n.id === notificationId)

    if (!notification) throw new Error(`Notification ${notificationId} not found`)

    notification.isRead = true
    this.notifications.set(userId, notifications)

    return notification
  }

  /**
   * ========== UTILITY METHODS ==========
   */

  /**
   * Get database statistics
   */
  getStats() {
    return {
      users: this.users.size,
      instructors: Array.from(this.instructorProfiles.values()).length,
      students: Array.from(this.studentProfiles.values()).length,
      bookings: this.bookings.size,
      reviews: this.reviews.size,
      conversations: this.conversations.size,
      messages: Array.from(this.messages.values()).reduce((sum, arr) => sum + arr.length, 0),
    }
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.users.clear()
    this.studentProfiles.clear()
    this.instructorProfiles.clear()
    this.coursePricing.clear()
    this.timeSlots.clear()
    this.bookings.clear()
    this.reviews.clear()
    this.conversations.clear()
    this.messages.clear()
    this.notifications.clear()
    this.userEmails.clear()
    this.initialized = false
  }
}

/**
 * Singleton using globalThis to survive HMR in dev mode
 */
const globalForDb = globalThis as unknown as { __redrive_db?: Database }

if (!globalForDb.__redrive_db) {
  globalForDb.__redrive_db = new Database()
}

export { Database }
export const db: Database = globalForDb.__redrive_db

export function getDatabase(): Database {
  return db
}

export default db
