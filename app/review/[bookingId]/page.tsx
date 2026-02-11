"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Star, Send, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

const getBookingById = (bookingId: string) => {
  const bookings = [
    {
      id: "1",
      instructorName: "田中 健太",
      instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      course: "2時限×7回コース (1/7)",
      date: "2024年12月15日",
    },
    {
      id: "2",
      instructorName: "山田 美咲",
      instructorAvatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      course: "2時限×4回コース (1/4)",
      date: "2024年12月18日",
    },
    {
      id: "3",
      instructorName: "鈴木 あゆみ",
      instructorAvatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
      course: "2時限×10回コース (10/10)",
      date: "2024年12月8日",
    },
    {
      id: "4",
      instructorName: "田中 健太",
      instructorAvatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      course: "2時限×7回コース (7/7)",
      date: "2024年12月1日",
    },
    {
      id: "5",
      instructorName: "山田 美咲",
      instructorAvatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      course: "2時限×4回コース (4/4)",
      date: "2024年11月25日",
    },
  ]

  return bookings.find((b) => b.id === bookingId)
}

export default function ReviewPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const router = useRouter()
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [comment, setComment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const booking = getBookingById(bookingId)

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-12 pb-8 space-y-6">
              <p className="text-muted-foreground">予約が見つかりませんでした</p>
              <Link href="/mypage">
                <Button>マイページに戻る</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const availableTags = [
    "丁寧",
    "わかりやすい",
    "優しい",
    "時間通り",
    "運転が上手",
    "安心感",
    "楽しい",
    "プロフェッショナル",
  ]

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("評価を選択してください")
      return
    }
    if (comment.trim().length < 10) {
      alert("レビューは10文字以上入力してください")
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      router.push("/mypage")
    }, 2000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center border-2 border-primary/20 shadow-lg">
            <CardContent className="pt-12 pb-8 space-y-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <CheckCircle className="h-16 w-16 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">投稿完了しました</h2>
                <p className="text-muted-foreground">
                  レビューをありがとうございました。
                  <br />
                  マイページに戻ります...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <Header />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Button
          variant="ghost"
          asChild
          className="mb-6 -ml-2 gap-2 text-foreground/80 hover:text-foreground hover:bg-primary/10"
        >
          <Link href="/mypage">
            <ArrowLeft className="h-4 w-4" />
            マイページに戻る
          </Link>
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">レッスンのレビュー</CardTitle>
              <CardDescription>レッスンの感想をお聞かせください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                  <Image
                    src={booking.instructorAvatar || "/placeholder.svg"}
                    alt={booking.instructorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg">{booking.instructorName}</h3>
                  <p className="text-sm text-muted-foreground">{booking.course}</p>
                  <p className="text-xs text-muted-foreground">{booking.date}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">評価</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-medium text-muted-foreground">
                      {rating === 5 && "最高でした！"}
                      {rating === 4 && "良かったです"}
                      {rating === 3 && "普通でした"}
                      {rating === 2 && "改善の余地あり"}
                      {rating === 1 && "残念でした"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">タグを選択（任意）</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="comment" className="text-sm font-semibold">
                  レビュー（10文字以上）
                </label>
                <Textarea
                  id="comment"
                  placeholder="レッスンの感想を教えてください&#10;例：丁寧に教えていただき、安心して運転できました。"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{comment.length} / 500文字</p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-lg"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
              >
                {isSubmitting ? (
                  "投稿中..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    レビューを投稿する
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
