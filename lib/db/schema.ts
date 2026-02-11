/**
 * Database Schema - TypeScript interfaces for all Re:Drive entities
 */

/**
 * User entity - Base user for both students and instructors
 */
export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: "student" | "instructor"
  avatar?: string
  phone?: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

/**
 * Student Profile - Additional info for student users
 */
export interface StudentProfile {
  userId: string
  licenseNumber?: string
  licenseExpiry?: string // ISO string
  address?: string
  postalCode?: string
  prefecture?: string
  city?: string
}

/**
 * Instructor Profile - Comprehensive instructor information
 */
export interface InstructorProfile {
  userId: string
  experience: number // Years of experience
  introduction: string
  carType: string
  transmissionTypes: ("AT" | "MT")[]
  specialties: string[]
  badges: string[]
  gender: "male" | "female"
  ageGroup: "20代" | "30代" | "40代" | "50代" | "60代"
  teachingStyle: string[]
  hasInstructorLicense: boolean
  serviceAreas: string
  designatedAreas: string[]
  travelAreas: string[]
  travelFee: number
  vehicleFee: number
  isApproved: boolean
  rating: number // Average rating
  reviewCount: number
}

/**
 * Course Pricing - Pricing tiers for an instructor
 */
export interface CoursePricing {
  id: string
  instructorId: string
  name: string
  duration: string // e.g., "100分"
  sessions: number
  price: number
}

/**
 * Time Slot - Available time slots for booking
 */
export interface TimeSlot {
  id: string
  instructorId: string
  date: string // ISO string YYYY-MM-DD
  period: "morning" | "afternoon" | "evening"
  isAvailable: boolean
  capacity: number
}

/**
 * Booking - Lesson booking information
 */
export interface Booking {
  id: string
  studentId: string
  instructorId: string
  courseId: string // CoursePricing id
  date: string // ISO string
  timeSlot: "morning" | "afternoon" | "evening"
  location: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected"
  transmissionType: "AT" | "MT"
  useInstructorCar: boolean
  meetingPoint?: string
  notes?: string
  totalPrice: number
  createdAt: string // ISO string
  updatedAt?: string // ISO string
}

/**
 * Review - Student review for completed lesson
 */
export interface Review {
  id: string
  bookingId: string
  studentId: string
  instructorId: string
  rating: number // 1-5
  comment: string
  tags: string[]
  createdAt: string // ISO string
  reply?: string // Instructor's reply
  replyDate?: string // ISO string
}

/**
 * Conversation - Chat conversation between student and instructor
 */
export interface Conversation {
  id: string
  studentId: string
  instructorId: string
  lastMessage?: string
  lastMessageTime?: string // ISO string
  unreadCountStudent: number
  unreadCountInstructor: number
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

/**
 * Message - Individual message in a conversation
 */
export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string // ISO string
  isRead: boolean
}

/**
 * Notification - User notifications
 */
export interface Notification {
  id: string
  userId: string
  type: "booking" | "review" | "message" | "system"
  title: string
  message: string
  isRead: boolean
  createdAt: string // ISO string
  data?: Record<string, unknown> // Additional data as needed
}

/**
 * Combined type for instructor with profile and user info
 */
export interface InstructorWithProfile extends User {
  profile: InstructorProfile
}

/**
 * Combined type for student with profile and user info
 */
export interface StudentWithProfile extends User {
  profile: StudentProfile
}
