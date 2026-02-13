"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Calendar, Clock, MessageCircle, Home, User, Sparkles, PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { instructors } from "@/lib/data"

function BookingCompleteContent() {
  const searchParams = useSearchParams()

  const instructorId = searchParams.get("instructor")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const total = searchParams.get("total")

  const instructor = instructors.find((i) => i.id === instructorId)

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const weekDay = ["日", "月", "火", "水", "木", "金", "土"][dateObj.getDay()]
    return `${year}年${month}月${day}日（${weekDay}）`
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-lg text-center">
            {/* Success Animation */}
            <div className="relative mx-auto h-24 w-24">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/30">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              <PartyPopper className="h-6 w-6 text-accent" />
              <h1 className="text-2xl font-bold text-foreground">予約リクエストを送信しました</h1>
              <PartyPopper className="h-6 w-6 text-accent" />
            </div>
            <p className="mt-3 text-muted-foreground">
              講師が予約を確認後、確定のお知らせをお送りします。
              <br />
              通常24時間以内に返信があります。
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-lg">
          {/* Booking Summary */}
          {instructor && date && time && (
            <Card className="border-2 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/20">
                    <Image
                      src={instructor.avatar || "/placeholder.svg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">{instructor.area}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-3 text-sm">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{formatDate(date)}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 p-3 text-sm">
                    <Clock className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">{time} 〜（2時間）</span>
                  </div>
                </div>

                {total && (
                  <div className="mt-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-t-0">
                    <span className="text-muted-foreground">合計金額</span>
                    <span className="text-xl font-bold text-primary">¥{Number.parseInt(total).toLocaleString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border-0 shadow-lg overflow-hidden">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                次のステップ
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-md">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">講師からの返信を待つ</p>
                    <p className="text-sm text-muted-foreground">通常24時間以内に返信があります</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/80 text-sm font-bold text-accent-foreground shadow-md">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">待ち合わせ場所の確認</p>
                    <p className="text-sm text-muted-foreground">講師とチャットで詳細を決めます</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-sm font-bold text-white shadow-md">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">当日レッスンを受ける</p>
                    <p className="text-sm text-muted-foreground">リラックスして練習を楽しんでください</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/30"
            >
              <Link href="/messages">
                <MessageCircle className="h-4 w-4" />
                メッセージを確認
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 gap-2 border-2 border-primary/30 hover:bg-primary/5 bg-transparent"
            >
              <Link href="/mypage">
                <User className="h-4 w-4" />
                マイページ
              </Link>
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button asChild variant="ghost" className="gap-2 hover:bg-primary/5">
              <Link href="/">
                <Home className="h-4 w-4" />
                トップページに戻る
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-gradient-to-r from-secondary to-secondary/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Re:Drive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function BookingCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      }
    >
      <BookingCompleteContent />
    </Suspense>
  )
}
