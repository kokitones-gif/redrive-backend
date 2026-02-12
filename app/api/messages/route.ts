import { NextRequest, NextResponse } from 'next/server'
import { getConversationsByUser, getUserById } from '@/lib/db/supabase-db'
import { requireAuth } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    const conversations = await getConversationsByUser(session.userId)

    const enriched = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = session.userId === conv.student_id ? conv.instructor_id : conv.student_id
        const otherUser = await getUserById(otherUserId)
        const unreadCount = session.userId === conv.student_id ? conv.unread_count_student : conv.unread_count_instructor

        return {
          ...conv,
          otherUser: otherUser ? { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar } : null,
          unreadCount,
        }
      })
    )

    return NextResponse.json({ data: enriched, total: enriched.length })
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    if (error.message?.includes('Not authenticated')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
