"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, ArrowLeft } from "lucide-react"
import { instructorConversations, instructorMessages } from "@/lib/data"
import Link from "next/link"
import Image from "next/image"

const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  onClick,
  lastMessage,
}: {
  conversation: any
  isSelected: boolean
  onClick: () => void
  lastMessage: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${isSelected ? "bg-secondary/70" : ""}`}
    >
      <div className="flex gap-3">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <Image
            src={conversation.studentAvatar || "/placeholder.svg"}
            alt={conversation.studentName}
            width={48}
            height={48}
            className="object-cover"
            loading="lazy"
            sizes="48px"
          />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-foreground truncate">{conversation.studentName}</h3>
            {conversation.unreadCount > 0 && (
              <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate mb-1">{lastMessage}</p>
          <p className="text-xs text-muted-foreground">{conversation.lastMessageTime}</p>
        </div>
      </div>
    </button>
  )
})

export default function InstructorMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [localMessages, setLocalMessages] = useState<Record<string, typeof instructorMessages[string]>>(instructorMessages)

  const filteredConversations = useMemo(
    () => instructorConversations.filter((conv) => conv.studentName.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  )

  const currentMessages = selectedConversation ? localMessages[selectedConversation] || [] : []
  const currentConversation = instructorConversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = useCallback(() => {
    if (messageText.trim() && selectedConversation) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: "1",
        senderName: "田中 健太",
        senderAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
        content: messageText.trim(),
        timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
      }
      setLocalMessages((prev) => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
      }))
      setMessageText("")
    }
  }, [messageText, selectedConversation])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* モバイル：会話リスト表示時のみヘッダー表示 */}
      {!selectedConversation && (
        <header className="border-b bg-card/80 backdrop-blur-sm lg:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Link href="/instructor-dashboard">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-bold">メッセージ</h1>
            </div>
          </div>
        </header>
      )}

      {/* デスクトップ用ヘッダー */}
      <header className="border-b bg-card/80 backdrop-blur-sm hidden lg:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/instructor-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">メッセージ</h1>
              <p className="text-sm text-muted-foreground">受講生とのやり取りを確認・管理</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-full lg:container lg:mx-auto lg:px-4 lg:py-6 lg:max-w-6xl flex">
          <div className="w-full lg:grid lg:grid-cols-3 lg:gap-6 flex">
            {/* 会話リスト */}
            <Card className={`lg:col-span-1 border-0 lg:border shadow-none lg:shadow-sm rounded-none lg:rounded-lg flex flex-col ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="受講生名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="divide-y flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">メッセージがありません</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const convMessages = localMessages[conversation.id] || []
                    const latestMessage = convMessages.length > 0 ? convMessages[convMessages.length - 1].content : conversation.lastMessage
                    return (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedConversation === conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        lastMessage={latestMessage}
                      />
                    )
                  })
                )}
              </div>
            </Card>

            {/* メッセージ詳細 - モバイルでは画面全体 */}
            {selectedConversation ? (
              <div className="fixed inset-0 z-50 bg-background flex flex-col lg:static lg:z-auto lg:col-span-2">
                <Card className="flex-1 flex flex-col border-0 lg:border shadow-none lg:shadow-sm rounded-none lg:rounded-lg">
                  {/* ヘッダー */}
                  <div className="p-3 lg:p-4 border-b flex items-center gap-3 bg-card">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConversation(null)}
                      className="h-9 w-9"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <Image
                        src={currentConversation?.studentAvatar || ""}
                        alt={currentConversation?.studentName || ""}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{currentConversation?.studentName}</h3>
                    </div>
                  </div>

                  {/* メッセージ一覧 */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {currentMessages.map((message) => {
                      const isMe = message.senderId === "1"
                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                        >
                          {!isMe && (
                            <Avatar className="h-8 w-8 border border-border flex-shrink-0">
                              <Image
                                src={message.senderAvatar || "/placeholder.svg"}
                                alt={message.senderName}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </Avatar>
                          )}
                          <div className={`flex-1 ${isMe ? "flex flex-col items-end" : ""}`}>
                            <div
                              className={`inline-block max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                isMe
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              <p className="text-sm text-pretty">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* 入力エリア */}
                  <div className="p-3 lg:p-4 border-t bg-card">
                    <div className="flex gap-2">
                      <Input
                        placeholder="メッセージを入力..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="px-6">
                        送信
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="hidden lg:flex lg:col-span-2 border shadow-sm flex-col items-center justify-center">
                <div className="text-center p-8">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <h3 className="font-semibold text-lg text-foreground mb-2">メッセージを選択</h3>
                  <p className="text-sm text-muted-foreground max-w-sm text-pretty">
                    左側の一覧から会話を選択してください
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
