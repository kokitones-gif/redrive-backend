"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, ArrowLeft } from "lucide-react"
import { conversations, messages } from "@/lib/data"
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
            src={conversation.instructorAvatar || "/placeholder.svg"}
            alt={conversation.instructorName}
            width={48}
            height={48}
            className="object-cover"
            loading="lazy"
            sizes="48px"
          />
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-foreground truncate">{conversation.instructorName}</h3>
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

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [localMessages, setLocalMessages] = useState<Record<string, typeof messages[string]>>(messages)

  const filteredConversations = useMemo(
    () => conversations.filter((conv) => conv.instructorName.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  )

  const currentMessages = selectedConversation ? localMessages[selectedConversation] || [] : []
  const currentConversation = conversations.find((c) => c.id === selectedConversation)

  const handleSendMessage = useCallback(() => {
    if (messageText.trim() && selectedConversation) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        senderId: "user",
        senderName: "山田 太郎",
        senderAvatar: "",
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* スマホ: 会話一覧表示時 */}
      <div className={`flex-1 flex flex-col ${selectedConversation ? "hidden lg:flex" : "flex"}`}>
        {/* スマホ用ヘッダー */}
        <div className="lg:hidden p-4 border-b bg-background">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/mypage">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-foreground">メッセージ</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="講師名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* スマホ用会話一覧 */}
        <div className="flex-1 overflow-y-auto lg:hidden">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">メッセージがありません</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => {
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
              })}
            </div>
          )}
        </div>

        {/* PC用レイアウト */}
        <div className="hidden lg:block container mx-auto px-4 py-8 flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/mypage">
                <Button variant="ghost" size="icon" className="bg-transparent">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">メッセージ</h1>
                <p className="text-sm text-muted-foreground mt-1">講師とのやり取りを確認・管理できます</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 border shadow-sm">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="講師名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
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

            <Card className="lg:col-span-2 border shadow-sm flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <Image
                        src={currentConversation?.instructorAvatar || ""}
                        alt={currentConversation?.instructorName || ""}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{currentConversation?.instructorName}</h3>
                      <Link
                        href={`/instructor/${currentConversation?.instructorId}`}
                        className="text-xs text-primary hover:underline"
                      >
                        プロフィールを見る
                      </Link>
                    </div>
                  </div>

                  <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-400px)]">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.senderId === "user" ? "flex-row-reverse" : ""}`}>
                          {message.senderId !== "user" && (
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
                          <div className={`${message.senderId === "user" ? "text-right" : ""}`}>
                            <div
                              className={`inline-block rounded-2xl px-4 py-2.5 ${
                                message.senderId === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              <p className="text-sm text-pretty">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
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
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <h3 className="font-semibold text-lg text-foreground mb-2">メッセージを選択</h3>
                    <p className="text-sm text-muted-foreground max-w-sm text-pretty">
                      左側の一覧から会話を選択してください
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* スマホ: 会話詳細表示時 - 画面いっぱい */}
      {selectedConversation && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden">
          {/* ヘッダー */}
          <div className="p-3 border-b flex items-center gap-3 bg-background">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
              className="bg-transparent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <Image
                src={currentConversation?.instructorAvatar || ""}
                alt={currentConversation?.instructorName || ""}
                width={40}
                height={40}
                className="object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{currentConversation?.instructorName}</h3>
              <Link
                href={`/instructor/${currentConversation?.instructorId}`}
                className="text-xs text-primary hover:underline"
              >
                プロフィールを見る
              </Link>
            </div>
          </div>

          {/* メッセージ一覧 */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {currentMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${message.senderId === "user" ? "flex-row-reverse" : ""}`}>
                  {message.senderId !== "user" && (
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
                  <div className={`${message.senderId === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block rounded-2xl px-4 py-2.5 ${
                        message.senderId === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm text-pretty">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">{message.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 入力エリア */}
          <div className="p-3 border-t bg-background">
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
              <Button onClick={handleSendMessage} disabled={!messageText.trim()} className="px-4">
                送信
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
