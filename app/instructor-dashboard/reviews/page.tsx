"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Star, MessageSquare, Send, User, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface Review {
  id: string
  bookingId: string
  studentName: string
  studentAvatar: string
  date: string
  rating: number
  comment: string
  course: string
  reply: string | null
  replyDate: string | null
}

const initialReviews: Review[] = [
  {
    id: "1",
    bookingId: "completed-1",
    studentName: "山本 花子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月20日",
    rating: 5,
    comment: "とても丁寧に教えていただきました。駐車が苦手だったのですが、コツを分かりやすく説明してくださり、自信がつきました。次回もよろしくお願いします！",
    course: "2時限×7回コース",
    reply: null,
    replyDate: null,
  },
  {
    id: "2",
    bookingId: "completed-2",
    studentName: "田村 優子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月18日",
    rating: 4,
    comment: "分かりやすい説明で、運転に対する不安が和らぎました。もう少し実践的な練習時間があると嬉しいです。",
    course: "2時限×4回コース",
    reply: "レビューありがとうございます！次回は実践練習を多めに取り入れますね。頑張りましょう！",
    replyDate: "2025年1月19日",
  },
  {
    id: "3",
    bookingId: "completed-3",
    studentName: "中村 健",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月17日",
    rating: 5,
    comment: "ペーパードライバー歴15年でしたが、先生のおかげで少しずつ運転できるようになってきました。穏やかな雰囲気で緊張せずレッスンを受けられます。",
    course: "2時限×7回コース",
    reply: "嬉しいお言葉ありがとうございます！15年のブランクを乗り越えて頑張っていらっしゃいますね。引き続きサポートします！",
    replyDate: "2025年1月17日",
  },
  {
    id: "4",
    bookingId: "completed-4",
    studentName: "佐々木 太郎",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月14日",
    rating: 5,
    comment: "高速道路の練習をお願いしました。合流のタイミングなど、的確なアドバイスをいただけて助かりました。",
    course: "2時限×10回コース",
    reply: null,
    replyDate: null,
  },
  {
    id: "5",
    bookingId: "completed-5",
    studentName: "田村 優子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月12日",
    rating: 5,
    comment: "3回目のレッスンでしたが、毎回成長を実感できます。縦列駐車もできるようになりました！",
    course: "2時限×4回コース",
    reply: "素晴らしい上達ですね！縦列駐車ができるようになったのは大きな進歩です。次回も頑張りましょう！",
    replyDate: "2025年1月13日",
  },
  {
    id: "6",
    bookingId: "completed-6",
    studentName: "山本 花子",
    studentAvatar: "/placeholder.svg?height=48&width=48",
    date: "2025年1月10日",
    rating: 5,
    comment: "初回レッスンでしたが、とても話しやすい先生で安心しました。これからのレッスンが楽しみです。",
    course: "2時限×7回コース",
    reply: "初回レッスンお疲れ様でした！リラックスしてレッスンを受けていただけて嬉しいです。一緒に頑張りましょう！",
    replyDate: "2025年1月10日",
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [replyText, setReplyText] = useState("")
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
  }))

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    
    setIsSubmitting(true)
    
    // シミュレート API呼び出し
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, reply: replyText.trim(), replyDate: new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }) }
        : review
    ))
    
    setReplyText("")
    setSelectedReviewId(null)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/instructor-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">評価・口コミ</h1>
              <p className="text-sm text-muted-foreground">受講生からのフィードバック</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 評価サマリー */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-5xl font-bold text-yellow-500">{averageRating}</span>
                  <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-sm text-muted-foreground">{reviews.length}件の口コミ</p>
              </div>
              <div className="flex-1 w-full space-y-2">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{rating}</span>
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}件</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 統計 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">返信済み</p>
              <p className="text-2xl font-bold text-primary">
                {reviews.filter(r => r.reply).length}/{reviews.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">未返信</p>
              <p className="text-2xl font-bold text-orange-500">
                {reviews.filter(r => !r.reply).length}件
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 口コミ一覧 */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={review.studentAvatar || "/placeholder.svg"} alt={review.studentName} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{review.studentName}</h3>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">{review.course}</Badge>
                      <Link href={`/instructor-dashboard/bookings/detail/${review.bookingId}`}>
                        <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          予約詳細
                        </Badge>
                      </Link>
                    </div>
                    <p className="text-sm text-foreground mb-3">{review.comment}</p>
                    
                    {/* 返信表示 */}
                    {review.reply ? (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">講師からの返信</span>
                          <span className="text-xs text-muted-foreground">{review.replyDate}</span>
                        </div>
                        <p className="text-sm">{review.reply}</p>
                      </div>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-transparent"
                            onClick={() => setSelectedReviewId(review.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            返信する
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>口コミに返信</DialogTitle>
                            <DialogDescription>
                              {review.studentName}さんの口コミに返信します
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-muted/50 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                          </div>
                          <Textarea
                            placeholder="返信を入力..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={4}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="bg-transparent">キャンセル</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button 
                                onClick={() => handleSubmitReply(review.id)}
                                disabled={!replyText.trim() || isSubmitting}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                {isSubmitting ? "送信中..." : "返信を送信"}
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
