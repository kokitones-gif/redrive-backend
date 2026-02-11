import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/database'
import { requireAuth } from '@/lib/auth/session'

/**
 * GET /api/messages/:conversationId
 * Get messages in a conversation and mark as read
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await requireAuth()

    await db.init()

    const { conversationId } = await params

    const conversation = db.getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify access
    if (session.userId !== conversation.studentId && session.userId !== conversation.instructorId) {
      return NextResponse.json(
        { error: 'Not authorized to view this conversation' },
        { status: 403 }
      )
    }

    // Get messages
    const messages = db.getMessages(conversationId)

    // Mark messages as read
    db.markMessagesAsRead(conversationId, session.userId)

    return NextResponse.json({
      conversationId,
      messages,
      total: messages.length,
    })
  } catch (error: any) {
    console.error('Error fetching messages:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages/:conversationId
 * Send a message in a conversation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await requireAuth()

    await db.init()

    const { conversationId } = await params

    const conversation = db.getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Verify access
    if (session.userId !== conversation.studentId && session.userId !== conversation.instructorId) {
      return NextResponse.json(
        { error: 'Not authorized to message in this conversation' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Get sender user info
    const sender = db.getUserById(session.userId)
    if (!sender) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Add message
    const message = db.addMessage(conversationId, {
      conversationId,
      senderId: session.userId,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content: content.trim(),
      isRead: false,
    })

    return NextResponse.json({
      message: 'Message sent',
      data: message,
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error sending message:', error)

    if (error.message.includes('Not authenticated')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
