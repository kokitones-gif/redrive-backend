"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Car,
  CreditCard,
  MessageSquare,
  FileText,
  CheckCircle,
  Phone,
  Mail,
  User,
  AlertTriangle,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id as string

  // ダミーデータ（実際はIDで検索）
  const bookings = {
    "1": {
      id: "1",
      instructor: {
        id: "1",
        name: "田中 健太",
        avatar: "/friendly-japanese-male-driving-instructor-in-his-4.jpg",
        phone: "090-1234-5678",
        email: "tanaka@example.com",
        carType: "トヨタ アクア",
        licensePlate: "品川 330 あ 1234",
      },
      course: {
        name: "初回体験コース",
        duration: "50分",
        price: 9000,
      },
      date: "2024年12月15日",
      time: "10:00-10:50",
      location: {
        name: "渋谷駅南口",
        address: "東京都渋谷区渋谷2-24-12",
        meetingPoint: "改札前の広場",
      },
      transmissionType: "AT",
      options: {
        useInstructorCar: true,
        pickupService: false,
      },
      status: "confirmed",
      bookingDate: "2024年12月10日",
      bookingNumber: "BK-20241210-001",
      payment: {
        method: "クレジットカード",
        last4: "4242",
        status: "支払い済み",
      },
      notes: "駐車の練習を重点的にお願いします。",
    },
    "2": {
      id: "2",
      instructor: {
        id: "2",
        name: "山田 美咲",
        avatar: "/friendly-japanese-female-driving-instructor-in-her.jpg",
        phone: "090-8765-4321",
        email: "yamada@example.com",
        carType: "ホンダ フィット",
        licensePlate: "品川 500 さ 5678",
      },
      course: {
        name: "2時限×4回コース",
        duration: "100分",
        price: 52800,
        currentSession: 1,
        totalSessions: 4,
      },
      date: "2024年12月18日",
      time: "14:00-15:40",
      location: {
        name: "新宿駅西口",
        address: "東京都新宿区西新宿1-1-3",
        meetingPoint: "ロータリー前",
      },
      transmissionType: "AT",
      options: {
        useInstructorCar: true,
        pickupService: true,
      },
      status: "confirmed",
      bookingDate: "2024年12月8日",
      bookingNumber: "BK-20241208-002",
      payment: {
        method: "クレジットカード",
        last4: "4242",
        status: "支払い済み",
      },
      notes: "",
    },
    "3": {
      id: "3",
      instructor: {
        id: "4",
        name: "鈴木 あゆみ",
        avatar: "/cheerful-japanese-female-driving-instructor-in-her.jpg",
        phone: "090-1111-2222",
        email: "suzuki@example.com",
        carType: "日産 ノート",
        licensePlate: "横浜 330 う 9876",
      },
      course: {
        name: "初回体験コース",
        duration: "50分",
        price: 9000,
      },
      date: "2024年12月8日",
      time: "10:00-10:50",
      location: {
        name: "横浜駅東口",
        address: "神奈川県横浜市西区高島2-19-12",
        meetingPoint: "そごう前",
      },
      transmissionType: "MT",
      options: {
        useInstructorCar: false,
        pickupService: false,
      },
      status: "completed",
      bookingDate: "2024年12月5日",
      bookingNumber: "BK-20241205-003",
      payment: {
        method: "クレジットカード",
        last4: "4242",
        status: "支払い済み",
      },
      notes: "ありがとうございました！",
      review: {
        rating: 5,
        comment: "とても分かりやすく教えていただきました。駐車が苦手でしたが、コツを掴むことができました。",
      },
    },
  }

  const booking = bookings[bookingId as keyof typeof bookings]

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">予約が見つかりません</p>
            <Link href="/mypage">
              <Button>マイページに戻る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCompleted = booking.status === "completed"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-6 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                予約詳細
              </h1>
              <p className="text-sm text-muted-foreground">予約番号: {booking.bookingNumber}</p>
            </div>
            <Badge variant={isCompleted ? "secondary" : "default"} className="h-8 px-4">
              {isCompleted ? "完了" : "確定"}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* 講師情報カード */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    講師情報
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-orange-600 cursor-pointer"
                        onClick={() => {
                          alert("通報機能は実装中です")
                        }}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        通報する
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => {
                          if (
                            confirm("この講師をブロックしますか？ブロックすると今後この講師の予約ができなくなります。")
                          ) {
                            alert("ブロック機能は実装中です")
                          }
                        }}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        ブロックする
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/20 shrink-0">
                    <Image
                      src={booking.instructor.avatar || "/placeholder.svg"}
                      alt={booking.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{booking.instructor.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.instructor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.instructor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.instructor.carType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{booking.instructor.licensePlate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/messages?instructor=${booking.instructor.name}`}>
                    <Button className="w-full bg-transparent" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      メッセージを送る
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* レッスン情報カード */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  レッスン情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">コース名</p>
                    <p className="font-medium">
                      {booking.course.name}
                      {booking.course.currentSession && (
                        <span className="text-sm text-primary ml-2">
                          ({booking.course.currentSession}/{booking.course.totalSessions}回目)
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">所要時間</p>
                    <p className="font-medium">{booking.course.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">日時</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.date}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">時間</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{booking.time}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 免許タイプ・オプション */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">免許タイプ</p>
                    <Badge variant={booking.transmissionType === "AT" ? "default" : "secondary"} className="text-sm">
                      {booking.transmissionType === "AT" ? "AT（オートマ）" : "MT（マニュアル）"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">オプション</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.options?.useInstructorCar && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          <Car className="h-3 w-3 mr-1" />
                          教習車利用
                        </Badge>
                      )}
                      {booking.options?.pickupService && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <MapPin className="h-3 w-3 mr-1" />
                          送迎あり
                        </Badge>
                      )}
                      {!booking.options?.useInstructorCar && !booking.options?.pickupService && (
                        <span className="text-sm text-muted-foreground">なし</span>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">待ち合わせ場所</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                      <div>
                        <p className="font-medium">{booking.location.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.location.address}</p>
                        <p className="text-sm text-primary mt-1">{booking.location.meetingPoint}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">備考・リクエスト</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">{booking.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* 料金情報カード */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  料金情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">レッスン料金</span>
                  <span className="text-lg font-bold">¥{booking.course.price.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>合計</span>
                  <span className="text-primary">¥{booking.course.price.toLocaleString()}</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {booking.payment.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {booking.payment.method} •••• {booking.payment.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">予約日: {booking.bookingDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* レビューカード（完了済みの場合） */}
            {isCompleted && booking.review && (
              <Card className="shadow-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    レビュー
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < booking.review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{booking.review.rating}.0</span>
                  </div>
                  <p className="text-sm bg-muted/50 p-4 rounded-lg">{booking.review.comment}</p>
                </CardContent>
              </Card>
            )}

            {/* レビュー投稿ボタン（完了済みでレビュー未投稿の場合） */}
            {isCompleted && !booking.review && (
              <Card className="shadow-lg border-dashed">
                <CardContent className="pt-6 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <CardTitle className="mb-2">レッスンの感想をお聞かせください</CardTitle>
                  <CardDescription className="mb-4">あなたのレビューが他の受講者の参考になります</CardDescription>
                  <Button className="w-full max-w-sm">レビューを書く</Button>
                </CardContent>
              </Card>
            )}

            {/* アクションボタン */}
            <div className="flex gap-4">
              <Link href="/mypage" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  マイページに戻る
                </Button>
              </Link>
              {!isCompleted && (
                <Button variant="outline" className="flex-1 text-destructive hover:text-destructive bg-transparent">
                  キャンセル
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
