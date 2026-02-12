import { NextRequest, NextResponse } from 'next/server'
import { getConversationById, getMessages, markMessagesAsRead, addMessage, getUserById } from '@/lib/db/supabase-db'
import { requireAuth } from '@/lib/auth/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await requireAuth()
    const { conversationId } = await params

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (session.userId !== conversation.student_id && session.userId !== conversation.instructor_id) {
      return NextResponse.json({ error: 'Not authorized to view this conversation' }, { status: 403 })
    }

    const messages = await getMessages(conversationId)
    await markMessagesAsRead(conversationId, session.userId)

    return NextResponse.json({ conversationId, messages, total: messages.length })
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await requireAuth()
    const { conversationId } = await params

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (session.userId !== conversation.student_id && session.userId !== conversation.instructor_id) {
      return NextResponse.json({ error: 'Not authorized to message in this conversation' }, { status: 403 })
    }

    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const message = await addMessage(conversationId, session.userId, content.trim())
    return NextResponse.json({ message: 'Message sent', data: message }, { status: 201 })
  } catch (error: any) {
    console.error('Error sending message:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
