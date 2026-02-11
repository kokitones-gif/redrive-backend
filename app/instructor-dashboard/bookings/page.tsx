"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Clock, MapPin, MessageCircle, AlertTriangle } from "lucide-react"
import { bookingRequests } from "@/lib/data"
import { useState } from "react"

export default function InstructorBookings() {
  const [filter, setFilter] = useState<"all" | "pending">("all")
  const [bookings, setBookings] = useState(bookingRequests)
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null)
  const [editingTime, setEditingTime] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{ bookingId: string; time: string } | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())

  const pendingCount = bookings.filter((b) => b.status === "pending").length

  const filteredBookings = filter === "all" ? bookings : bookings.filter((b) => b.status === "pending")

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const timeA = new Date(`${a.date} ${a.time}`).getTime()
    const timeB = new Date(`${b.date} ${b.time}`).getTime()
    return sortOrder === "asc" ? timeA - timeB : timeB - timeA
  })

  const handleUpdateTime = (bookingId: string, time: string) => {
    setPendingUpdate({ bookingId, time })
    setConfirmDialogOpen(true)
  }

  const handleConfirmTimeUpdate = () => {
    if (!pendingUpdate) return

    const { bookingId, time } = pendingUpdate

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? {
              ...booking,
              time: time,
              status: "confirmed" as const,
            }
          : booking,
      ),
    )

    setEditingBookingId(null)
    setConfirmDialogOpen(false)
    setPendingUpdate(null)
    setEditingTime("")
  }

  const handleApprove = (id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b)))
  }

  const handleReject = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  const toggleMessageExpansion = (bookingId: string) => {
    setExpandedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId)
      } else {
        newSet.add(bookingId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/instructor-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">予約リクエスト</h1>
              <p className="text-sm text-muted-foreground">承認待ちの予約</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Statistics Chips */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border rounded-full">
              <span className="text-sm text-muted-foreground">今週の予約:</span>
              <span className="font-bold text-lg">{bookings.length}件</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
              <span className="text-sm text-orange-700">仮予約:</span>
              <span className="font-bold text-lg text-orange-700">{pendingCount}件</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <span className="text-sm text-green-700">確定:</span>
              <span className="font-bold text-lg text-green-700">{bookings.length - pendingCount}件</span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="rounded-full"
            >
              すべて
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="rounded-full"
            >
              仮予約
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="rounded-full ml-auto"
            >
              <Clock className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? "時間順 ↑" : "時間順 ↓"}
            </Button>
          </div>
        </div>

        {sortedBookings.length === 0 ? (
          <Card className="border-2">
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">新しい予約リクエストはありません</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {sortedBookings.map((booking) => {
              const isTimeUnset = !booking.time || booking.time === "--:--"
              const isMessageExpanded = expandedMessages.has(booking.id)
              const shouldTruncate = booking.notes && booking.notes.length > 100
              const displayMessage =
                shouldTruncate && !isMessageExpanded ? `${booking.notes.substring(0, 100)}...` : booking.notes

              return (
                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    {/* Mobile Layout */}
                    <div className="md:hidden">
                      {/* Header: Status Badge + Date */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {booking.status === "confirmed" ? "確定" : "仮予約"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}（
                            {["日", "月", "火", "水", "木", "金", "土"][new Date(booking.date).getDay()]}）
                          </span>
                        </div>
                        {isTimeUnset ? (
                          <span className="text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            時間未設定
                          </span>
                        ) : (
                          <span className="text-sm font-medium">{booking.time}</span>
                        )}
                      </div>

                      {/* Student Name + Avatar */}
                      <Link
                        href={`/instructor-dashboard/bookings/detail/${booking.id}`}
                        className="flex items-center gap-3 mb-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                          {booking.studentName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base truncate">{booking.studentName}</div>
                          <div className="text-xs text-muted-foreground truncate">{booking.course}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-primary">¥{booking.price.toLocaleString()}</div>
                        </div>
                      </Link>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 bg-muted/30 rounded-lg px-3 py-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{booking.meetingPoint}</span>
                      </div>

                      {/* Notes (collapsed by default on mobile) */}
                      {booking.notes && (
                        <div className="bg-muted/50 rounded-lg p-3 mb-3">
                          <div className="text-xs text-muted-foreground mb-1">メッセージ</div>
                          <div className="text-sm leading-relaxed">{displayMessage}</div>
                          <div className="mt-2 flex gap-3">
                            {shouldTruncate && (
                              <button
                                onClick={() => toggleMessageExpansion(booking.id)}
                                className="text-xs text-primary hover:underline"
                              >
                                {isMessageExpanded ? "折りたたむ" : "続きを読む"}
                              </button>
                            )}
                            <Link
                              href={`/instructor-dashboard/messages?studentId=${booking.studentId}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              返信
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Actions - Full width buttons on mobile */}
                      {booking.status === "pending" && (
                        <div className="space-y-2">
                          {editingBookingId === booking.id ? (
                            <div className="space-y-2">
                              <Input
                                type="time"
                                value={editingTime}
                                onChange={(e) => setEditingTime(e.target.value)}
                                className="w-full"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1" onClick={() => handleUpdateTime(booking.id, editingTime)}>
                                  保存
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => setEditingBookingId(null)}>
                                  キャンセル
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprove(booking.id)}
                                className="flex-1 bg-green-600 hover:bg-green-700 font-semibold"
                                size="sm"
                              >
                                確定
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => {
                                  setEditingBookingId(booking.id)
                                  setEditingTime("10:00")
                                }}
                              >
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                時間設定
                              </Button>
                              <Button
                                onClick={() => handleReject(booking.id)}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground px-2"
                              >
                                取消
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden md:block">
                      <div className="flex items-start gap-4">
                        {/* Student Avatar */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-lg font-bold text-primary">
                            {booking.studentName.charAt(0)}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          {/* Header: Name and Status */}
                          <div className="flex items-center justify-between mb-3">
                            <Link
                              href={`/instructor-dashboard/bookings/detail/${booking.id}`}
                              className="font-bold text-lg hover:text-primary transition-colors"
                            >
                              {booking.studentName}
                            </Link>
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {booking.status === "confirmed" ? "確定" : "仮予約"}
                            </span>
                          </div>

                          {/* Course and Price */}
                          <div className="flex items-center justify-between mb-4 pb-4 border-b">
                            <span className="text-sm text-muted-foreground">{booking.course}</span>
                            <span className="text-lg font-bold text-primary">¥{booking.price.toLocaleString()}</span>
                          </div>

                          {/* Date, Time, Location */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">日時</div>
                              <div className="font-semibold">
                                {new Date(booking.date).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}（
                                {["日", "月", "火", "水", "木", "金", "土"][new Date(booking.date).getDay()]}）
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">時間</div>
                              {isTimeUnset ? (
                                <div className="font-semibold flex items-center gap-1 text-orange-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  未設定
                                </div>
                              ) : (
                                <div className="font-semibold flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {booking.time}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">待ち合わせ場所</div>
                              <div className="font-semibold flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.meetingPoint}
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {booking.notes && (
                            <div className="bg-muted/50 rounded-lg p-3 mb-4">
                              <div className="text-xs text-muted-foreground mb-1">メッセージ</div>
                              <div className="text-sm">{displayMessage}</div>
                              <div className="mt-2 flex gap-2">
                                {shouldTruncate && (
                                  <button
                                    onClick={() => toggleMessageExpansion(booking.id)}
                                    className="text-xs text-primary hover:underline"
                                  >
                                    {isMessageExpanded ? "折りたたむ" : "続きを読む"}
                                  </button>
                                )}
                                <Link
                                  href={`/instructor-dashboard/messages?studentId=${booking.studentId}`}
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  返信する
                                </Link>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          {booking.status === "pending" && (
                            <div className="flex flex-wrap gap-2">
                              {editingBookingId === booking.id ? (
                                <div className="flex-1 flex gap-2">
                                  <Input
                                    type="time"
                                    value={editingTime}
                                    onChange={(e) => setEditingTime(e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button size="sm" onClick={() => handleUpdateTime(booking.id, editingTime)}>
                                    保存
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingBookingId(null)}>
                                    キャンセル
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleApprove(booking.id)}
                                    className="bg-green-600 hover:bg-green-700 font-semibold"
                                    size="default"
                                  >
                                    確定する
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="default"
                                    onClick={() => {
                                      setEditingBookingId(booking.id)
                                      setEditingTime("10:00")
                                    }}
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    時間を設定
                                  </Button>
                                  <Button
                                    onClick={() => handleReject(booking.id)}
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground"
                                  >
                                    予約キャンセル
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {/* Confirmation Dialog for time setting */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>予約を確定しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              時間を {pendingUpdate?.time} に設定し、予約を確定します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmDialogOpen(false)
                setPendingUpdate(null)
              }}
            >
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTimeUpdate}>確定する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
