/**
 * Database Seed - Initialize database with sample data
 */

import { instructors as mockInstructors } from "../data"
import type { Database } from "./database"

/**
 * Hash password - simple hash for development (NOT for production)
 * In production, use bcryptjs
 */
function hashPassword(password: string): string {
  // Simple hash for development only
  return Buffer.from(password).toString("base64")
}

/**
 * Seed the database with initial data
 */
export async function seed(db: Database): Promise<void> {
  try {
    // Create student users
    const students = createStudents(db)

    // Create instructor users and profiles from mock data
    const instructorUsers = createInstructors(db)

    // Create sample bookings
    createSampleBookings(db, students, instructorUsers)

    // Create sample reviews
    createSampleReviews(db, students, instructorUsers)

    // Create sample conversations and messages
    createSampleConversations(db, students, instructorUsers)

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

/**
 * Create sample student users
 */
function createStudents(db: Database): string[] {
  const studentsData = [
    {
      email: "student1@redrive.example",
      name: "山本 花子",
      phone: "090-1234-5678",
      password: "password123",
    },
    {
      email: "student2@redrive.example",
      name: "中村 太郎",
      phone: "090-9876-5432",
      password: "password123",
    },
    {
      email: "student3@redrive.example",
      name: "佐藤 由美",
      phone: "090-5555-1111",
      password: "password123",
    },
  ]

  const studentIds: string[] = []

  studentsData.forEach((data) => {
    const user = db.createUser({
      email: data.email,
      name: data.name,
      passwordHash: hashPassword(data.password),
      role: "student",
      phone: data.phone,
      avatar: "/default-student-avatar.jpg",
    })

    db.updateStudentProfile(user.id, {
      userId: user.id,
      licenseNumber: `DL${Math.random().toString().substring(2, 10)}`,
      licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      address: "東京都渋谷区",
      postalCode: "150-0001",
      prefecture: "東京都",
      city: "渋谷区",
    })

    studentIds.push(user.id)
  })

  return studentIds
}

/**
 * Create instructor users from mock data
 */
function createInstructors(db: Database): string[] {
  const instructorIds: string[] = []

  // Use the first 20 instructors from the mock data
  mockInstructors.slice(0, 20).forEach((mockInstructor) => {
    // Create user for instructor
    const user = db.createUser({
      email: `instructor${mockInstructor.id}@redrive.example`,
      name: mockInstructor.name,
      passwordHash: hashPassword("password123"),
      role: "instructor",
      phone: `090-${Math.random().toString().substring(2, 6)}-${Math.random().toString().substring(2, 6)}`,
      avatar: mockInstructor.avatar,
    })

    // Create instructor profile
    db.updateInstructorProfile(user.id, {
      userId: user.id,
      experience: mockInstructor.experience,
      introduction: mockInstructor.introduction,
      carType: mockInstructor.carType,
      transmissionTypes: mockInstructor.transmissionTypes,
      specialties: mockInstructor.specialties,
      badges: mockInstructor.badges,
      gender: mockInstructor.gender,
      ageGroup: mockInstructor.ageGroup,
      teachingStyle: mockInstructor.teachingStyle,
      hasInstructorLicense: mockInstructor.hasInstructorLicense,
      serviceAreas: mockInstructor.serviceAreas,
      designatedAreas: mockInstructor.designatedAreas,
      travelAreas: mockInstructor.travelAreas,
      travelFee: mockInstructor.travelFee,
      vehicleFee: mockInstructor.vehicleFee,
      isApproved: true,
      rating: mockInstructor.rating,
      reviewCount: mockInstructor.reviewCount,
    })

    // Create course pricing from mock data
    const courses = mockInstructor.coursePrices.map((price) => ({
      instructorId: user.id,
      name: price.name,
      duration: price.duration,
      sessions: price.sessions,
      price: price.price,
    }))

    db.updateCoursePricing(user.id, courses)

    // Create time slots from available dates
    const availableDates = mockInstructor.availableDates || []
    availableDates.forEach((date) => {
      const periods: ("morning" | "afternoon" | "evening")[] = [
        "morning",
        "afternoon",
        "evening",
      ]
      const capacity = mockInstructor.timeSlotCapacity || { morning: 2, afternoon: 2, evening: 2 }

      periods.forEach((period) => {
        const periodCapacity =
          capacity[period as keyof typeof capacity] || 2

        db.addTimeSlot({
          instructorId: user.id,
          date,
          period,
          isAvailable: true,
          capacity: periodCapacity,
        })
      })
    })

    // Add reviews from testimonials if available
    if (mockInstructor.testimonials) {
      mockInstructor.testimonials.forEach((testimonial) => {
        // For seeding, we'll skip adding reviews as we need real student/booking data
        // Reviews are typically created after bookings are completed
      })
    }

    instructorIds.push(user.id)
  })

  return instructorIds
}

/**
 * Create sample bookings
 */
function createSampleBookings(
  db: Database,
  studentIds: string[],
  instructorIds: string[]
): void {
  if (studentIds.length === 0 || instructorIds.length === 0) return

  const sampleBookings = [
    {
      studentId: studentIds[0],
      instructorId: instructorIds[0],
      courseIndex: 0,
      status: "completed" as const,
      daysFromNow: -5,
    },
    {
      studentId: studentIds[0],
      instructorId: instructorIds[1],
      courseIndex: 1,
      status: "confirmed" as const,
      daysFromNow: 3,
    },
    {
      studentId: studentIds[1],
      instructorId: instructorIds[2],
      courseIndex: 0,
      status: "pending" as const,
      daysFromNow: 7,
    },
    {
      studentId: studentIds[1],
      instructorId: instructorIds[0],
      courseIndex: 1,
      status: "completed" as const,
      daysFromNow: -10,
    },
    {
      studentId: studentIds[2],
      instructorId: instructorIds[3],
      courseIndex: 0,
      status: "confirmed" as const,
      daysFromNow: 5,
    },
  ]

  sampleBookings.forEach((booking) => {
    const instructor = db.getInstructorById(booking.instructorId)
    const courses = db.getCoursePricing(booking.instructorId)

    if (!instructor || courses.length === 0) return

    const course = courses[booking.courseIndex] || courses[0]
    const bookingDate = new Date()
    bookingDate.setDate(bookingDate.getDate() + booking.daysFromNow)

    db.createBooking({
      studentId: booking.studentId,
      instructorId: booking.instructorId,
      courseId: course.id,
      date: bookingDate.toISOString().split("T")[0],
      timeSlot: ["morning", "afternoon", "evening"][
        Math.floor(Math.random() * 3)
      ] as "morning" | "afternoon" | "evening",
      location: instructor.profile.designatedAreas[0] || "東京都渋谷区",
      status: booking.status,
      transmissionType: Math.random() > 0.5 ? "AT" : "MT",
      useInstructorCar: true,
      meetingPoint: instructor.profile.designatedAreas[0] || "駅前",
      notes:
        booking.status === "pending"
          ? "初心者です。丁寧に教えてください。"
          : "次のレッスンをお願いします。",
      totalPrice: course.price,
    })
  })
}

/**
 * Create sample reviews
 */
function createSampleReviews(
  db: Database,
  studentIds: string[],
  instructorIds: string[]
): void {
  if (studentIds.length === 0 || instructorIds.length === 0) return

  const reviewSamples = [
    {
      studentId: studentIds[0],
      instructorId: instructorIds[0],
      rating: 5,
      comment: "非常に丁寧な指導ありがとうございました！安心して運転できるようになりました。",
      tags: ["丁寧", "安心", "初心者向け"],
      reply: "嬉しいお言葉ありがとうございます。これからも安全運転でお願いします！",
    },
    {
      studentId: studentIds[1],
      instructorId: instructorIds[2],
      rating: 4,
      comment: "高速道路の練習が特に役立ちました。少し厳しめですが効果的です。",
      tags: ["高速道路", "実践的", "ベテラン"],
    },
    {
      studentId: studentIds[1],
      instructorId: instructorIds[0],
      rating: 5,
      comment: "10年ぶりの運転でしたが、基礎から教えていただき自信が戻りました。",
      tags: ["ブランク対応", "丁寧", "実用的"],
      reply: "ブランクを乗り越えてくださり素晴らしいです。引き続き安全運転を！",
    },
    {
      studentId: studentIds[2],
      instructorId: instructorIds[3],
      rating: 5,
      comment: "駐車が苦手でしたが、わかりやすい説明でコツを掴めました。",
      tags: ["駐車", "わかりやすい", "女性講師"],
    },
  ]

  reviewSamples.forEach((sample) => {
    // Find a completed booking for this student-instructor pair
    const bookings = db.getBookingsByStudent(sample.studentId)
    const relatedBooking = bookings.find(
      (b) => b.instructorId === sample.instructorId && b.status === "completed"
    )

    if (!relatedBooking) {
      // Create a booking for this review if it doesn't exist
      const booking = db.createBooking({
        studentId: sample.studentId,
        instructorId: sample.instructorId,
        courseId: `course-${Math.random().toString()}`,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        timeSlot: "morning",
        location: "東京都渋谷区",
        status: "completed",
        transmissionType: "AT",
        useInstructorCar: true,
        totalPrice: 9000,
      })

      const review = db.createReview({
        bookingId: booking.id,
        studentId: sample.studentId,
        instructorId: sample.instructorId,
        rating: sample.rating,
        comment: sample.comment,
        tags: sample.tags,
      })

      if (sample.reply) {
        db.addReplyToReview(review.id, sample.reply)
      }
    } else {
      const review = db.createReview({
        bookingId: relatedBooking.id,
        studentId: sample.studentId,
        instructorId: sample.instructorId,
        rating: sample.rating,
        comment: sample.comment,
        tags: sample.tags,
      })

      if (sample.reply) {
        db.addReplyToReview(review.id, sample.reply)
      }
    }
  })
}

/**
 * Create sample conversations and messages
 */
function createSampleConversations(
  db: Database,
  studentIds: string[],
  instructorIds: string[]
): void {
  if (studentIds.length === 0 || instructorIds.length === 0) return

  const conversationPairs = [
    { studentId: studentIds[0], instructorId: instructorIds[0] },
    { studentId: studentIds[0], instructorId: instructorIds[1] },
    { studentId: studentIds[1], instructorId: instructorIds[2] },
    { studentId: studentIds[2], instructorId: instructorIds[3] },
  ]

  conversationPairs.forEach((pair) => {
    const conversation = db.getOrCreateConversation(pair.studentId, pair.instructorId)

    const messages = [
      {
        senderId: pair.studentId,
        senderName: "学生",
        content: "予約についてお聞きしたいことがあります。",
      },
      {
        senderId: pair.instructorId,
        senderName: "講師",
        content: "もちろんです。何でもお気軽にお聞きください。",
      },
      {
        senderId: pair.studentId,
        senderName: "学生",
        content: "初心者ですが、優しく教えていただけますか？",
      },
      {
        senderId: pair.instructorId,
        senderName: "講師",
        content: "もちろんです。初心者の方は多いので、ゆっくり丁寧に教えます。安心してください！",
      },
    ]

    messages.forEach((msg) => {
      db.addMessage(conversation.id, {
        conversationId: conversation.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: msg.content,
        isRead: false,
      })
    })

    // Mark messages from instructor as read by student
    db.markMessagesAsRead(conversation.id, pair.studentId)
  })
}
