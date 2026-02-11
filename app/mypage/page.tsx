"use client"
import { useState, memo, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  User,
  Calendar,
  MessageSquare,
  Settings,
  CreditCard,
  Bell,
  ChevronRight,
  Clock,
  MapPin,
  Car,
  Ticket,
  Search,
  CalendarPlus,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BookingCard = memo(function BookingCard({
  booking,
  type,
}: {
  booking: any
  type: "upcoming" | "past"
}) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${type === "past" ? "opacity-80" : ""} relative`}>
      {type === "past" && !booking.hasReview && (
        <div className="absolute top-3 right-3 z-10">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div
            className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 shrink-0 ${
              type === "past" ? "ring-muted" : "ring-primary/20"
            }`}
          >
            <Image
              src={booking.instructor.avatar || "/placeholder.svg"}
              alt={booking.instructor.name}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 64px, 80px"
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h4 className="font-bold text-lg md:text-xl">{booking.instructor.name}</h4>
                {type === "upcoming" && booking.remainingTickets !== undefined && booking.remainingTickets > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary">残チケット {booking.remainingTickets}枚</span>
                  </div>
                )}
                <p className={`text-sm font-medium mt-1 ${type === "past" ? "text-muted-foreground" : "text-primary"}`}>
                  {booking.course}
                </p>
              </div>
              <Badge variant={type === "past" ? "secondary" : "default"} className="shrink-0">
                {type === "past" ? "完了" : "確定"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div className={`flex items-center gap-2 text-sm ${type === "past" ? "text-muted-foreground" : ""}`}>
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{booking.date}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${type === "past" ? "text-muted-foreground" : ""}`}>
                <Clock className="h-4 w-4 shrink-0" />
                <span>{booking.time}</span>
              </div>
              {type === "upcoming" && (
                <div className="flex items-center gap-2 text-sm sm:col-span-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{booking.location}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {type === "upcoming" && (
                <Link href={`/messages?instructor=${booking.instructor.name}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    メッセージ
                  </Button>
                </Link>
              )}
              <Link href={`/mypage/bookings/${booking.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  詳細を見る
                </Button>
              </Link>
              {type === "past" && (
                <Link href={`/review/${booking.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Star className="h-4 w-4 mr-2" />
                    レビューを書く
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [showUnreviewedOnly, setShowUnreviewedOnly] = useState(false)
  const bookingsRef = useRef<HTMLDivElement>(null)

  const user = {
    name: "山田 太郎",
    email: "yamada@example.com",
    phone: "090-1234-5678",
    avatar: "/abstract-geometric-shapes.png",
    memberSince: "2024年12月",
  }

  const upcomingBookings = [
    {
      id: "1",
      instructor: {
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      },
      course: "2時限×7回コース (1/7)",
      date: "2024年12月15日",
      time: "10:00-11:40",
      location: "東京都 渋谷区",
      status: "confirmed",
      remainingTickets: 6,
    },
    {
      id: "2",
      instructor: {
        name: "山田 美咲",
        avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      },
      course: "2時限×4回コース (1/4)",
      date: "2024年12月18日",
      time: "14:00-15:40",
      location: "東京都 新宿区",
      status: "confirmed",
      remainingTickets: 3,
    },
  ]

  const pastBookings = [
    {
      id: "3",
      instructor: {
        name: "鈴木 あゆみ",
        avatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
      },
      course: "2時限×10回コース (10/10)",
      date: "2024年12月8日",
      time: "10:00-11:40",
      location: "神奈川県 横浜市",
      status: "completed",
      hasReview: false,
    },
    {
      id: "4",
      instructor: {
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      },
      course: "2時限×7回コース (4/7)",
      date: "2024年12月1日",
      time: "14:00-15:40",
      location: "東京都 渋谷区",
      status: "completed",
      hasReview: false,
    },
    {
      id: "5",
      instructor: {
        name: "山田 美咲",
        avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      },
      course: "2時限×10回コース (3/10)",
      date: "2024年11月25日",
      time: "10:00-11:40",
      location: "東京都 新宿区",
      status: "completed",
      hasReview: true,
    },
    {
      id: "6",
      instructor: {
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      },
      course: "2時限×7回コース (3/7)",
      date: "2024年11月20日",
      time: "10:00-11:40",
      location: "東京都 渋谷区",
      status: "completed",
      hasReview: true,
    },
    {
      id: "7",
      instructor: {
        name: "山田 美咲",
        avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      },
      course: "2時限×10回コース (2/10)",
      date: "2024年11月15日",
      time: "14:00-15:40",
      location: "東京都 新宿区",
      status: "completed",
      hasReview: true,
    },
    {
      id: "8",
      instructor: {
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      },
      course: "2時限×7回コース (2/7)",
      date: "2024年11月10日",
      time: "10:00-11:40",
      location: "東京都 渋谷区",
      status: "completed",
      hasReview: true,
    },
    {
      id: "9",
      instructor: {
        name: "山田 美咲",
        avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
      },
      course: "2時限×10回コース (1/10)",
      date: "2024年11月5日",
      time: "10:00-11:40",
      location: "東京都 新宿区",
      status: "completed",
      hasReview: true,
    },
    {
      id: "10",
      instructor: {
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
      },
      course: "2時限×7回コース (1/7)",
      date: "2024年11月1日",
      time: "14:00-15:40",
      location: "東京都 渋谷区",
      status: "completed",
      hasReview: true,
    },
  ]

  useEffect(() => {
    if (activeTab === "past" && showUnreviewedOnly && bookingsRef.current) {
      setTimeout(() => {
        bookingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [activeTab, showUnreviewedOnly])

  const filteredPastBookings = showUnreviewedOnly ? pastBookings.filter((booking) => !booking.hasReview) : pastBookings

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              マイページ
            </h1>
            <p className="text-muted-foreground">予約の管理とアカウント設定</p>
          </div>

          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">クイックアクション</CardTitle>
              <CardDescription>よく使う機能にすばやくアクセス</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary bg-transparent"
                  >
                    <Search className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-foreground">新しい講師を探す</span>
                    <span className="text-xs text-muted-foreground text-center">別の講師を試したい場合</span>
                  </Button>
                </Link>
                <Link href="/mypage/instructors" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary bg-transparent"
                  >
                    <CalendarPlus className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-foreground">次回予約を入れる</span>
                    <span className="text-xs text-muted-foreground text-center">コース継続の予約をスムーズに</span>
                  </Button>
                </Link>
                <button
                  className="flex flex-col items-center gap-2 py-4 px-4 rounded-lg border border-input bg-transparent hover:bg-primary/5 hover:border-primary transition-colors"
                  onClick={() => {
                    setActiveTab("past")
                    setShowUnreviewedOnly(true)
                  }}
                >
                  <Star className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">レビューを書く</span>
                  <span className="text-xs text-muted-foreground text-center">過去レッスンへのレビュー導線</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="space-y-6 xl:col-span-1">
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-primary/20">
                        <Image
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          width={112}
                          height={112}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center ring-4 ring-card">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">会員登録: {user.memberSince}</p>
                    </div>
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href="/mypage/settings">
                          <User className="h-4 w-4 mr-2" />
                          基本情報
                        </Link>
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href="/mypage/account">
                          <Settings className="h-4 w-4 mr-2" />
                          アカウント
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">クイックメニュー</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/messages">
                    <Button variant="ghost" className="w-full justify-start h-12">
                      <MessageSquare className="h-5 w-5 mr-3 text-primary" />
                      <span className="flex-1 text-left">メッセージ</span>
                      <Badge variant="secondary">2</Badge>
                      <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </Button>
                  </Link>
                  <Link href="/mypage/payment">
                    <Button variant="ghost" className="w-full justify-start h-12">
                      <CreditCard className="h-5 w-5 mr-3 text-primary" />
                      <span className="flex-1 text-left">支払い方法</span>
                      <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </Button>
                  </Link>
                  <Link href="/mypage/notifications">
                    <Button variant="ghost" className="w-full justify-start h-12">
                      <Bell className="h-5 w-5 mr-3 text-primary" />
                      <span className="flex-1 text-left">通知設定</span>
                      <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-2">
              <Card className="shadow-lg" ref={bookingsRef}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    予約情報
                  </CardTitle>
                  <CardDescription>レッスンの予約状況を確認できます</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="upcoming">予定 ({upcomingBookings.length})</TabsTrigger>
                      <TabsTrigger value="past">過去 ({pastBookings.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="space-y-4">
                      {upcomingBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">予定されているレッスンはありません</p>
                          <Link href="/">
                            <Button className="mt-4">講師を探す</Button>
                          </Link>
                        </div>
                      ) : (
                        upcomingBookings.map((booking) => (
                          <BookingCard key={booking.id} booking={booking} type="upcoming" />
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="past" className="space-y-4">
                      {filteredPastBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            {showUnreviewedOnly ? "レビュー未記入のレッスンはありません" : "過去のレッスンはありません"}
                          </p>
                          {showUnreviewedOnly && (
                            <Button
                              variant="outline"
                              className="mt-4 bg-transparent"
                              onClick={() => setShowUnreviewedOnly(false)}
                            >
                              すべての予約を表示
                            </Button>
                          )}
                        </div>
                      ) : (
                        filteredPastBookings.map((booking) => (
                          <BookingCard key={booking.id} booking={booking} type="past" />
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
