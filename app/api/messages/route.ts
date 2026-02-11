import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireAuth } from '@/lib/auth/session'

/**
 * GET /api/messages
 * Get all conversations for current user with last message preview
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    await db.init()

    // Get all conversations for the user
    const conversations = db.getConversationsByUser(session.userId)

    // Sort by last message time descending
    conversations.sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0
      return timeB - timeA
    })

    // Enrich with user info
    const enriched = conversations.map((conv) => {
      const otherUserId = session.userId === conv.studentId ? conv.instructorId : conv.studentId
      const otherUser = db.getUserById(otherUserId)

      // Get unread count for current user
      const unreadCount = session.userId === conv.studentId ? conv.unreadCountStudent : conv.unreadCountInstructor

      return {
        ...conv,
        otherUser: otherUser
          ? { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar }
          : null,
        unreadCount,
      }
    })

    return NextResponse.json({
      data: enriched,
      total: enriched.length,
    })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
