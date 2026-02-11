"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, MapPin, Car, CreditCard, Shield, Sparkles, Tag, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/header"
import { instructors } from "@/lib/data"
import { coursePackages } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

function BookingConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<string>("")
  const [useInstructorVehicle, setUseInstructorVehicle] = useState(false)

  const instructorId = searchParams.get("instructor")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const courseIndex = Number.parseInt(searchParams.get("course") || "0", 10)

  const instructor = instructors.find((i) => i.id === instructorId)

  const studentId = "s1" // In real app, get from session/auth
  const existingPackage = coursePackages.find(
    (pkg) => pkg.studentId === studentId && pkg.instructorId === instructorId && pkg.remainingTickets > 0,
  )

  if (!instructor || !date || !time) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">予約情報が見つかりませんでした。</p>
          <Button asChild className="mt-4">
            <Link href="/">トップに戻る</Link>
          </Button>
        </div>
      </div>
    )
  }

  const selectedCourse = instructor.coursePrices[courseIndex] || instructor.coursePrices[0]

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    const weekDay = ["日", "月", "火", "水", "木", "金", "土"][dateObj.getDay()]
    return `${year}年${month}月${day}日（${weekDay}）`
  }

  const meetingPointOptions = [...instructor.designatedAreas, ...instructor.travelAreas].filter(
    (area, index, self) => self.indexOf(area) === index,
  ) // 重複削除

  const isTravelArea = instructor.travelAreas.includes(selectedMeetingPoint)
  const travelFee = isTravelArea ? instructor.travelFee : 0
  const vehicleFee = useInstructorVehicle ? instructor.vehicleFee : 0

  const isUsingTicket = existingPackage && selectedCourse.sessions === 1
  const coursePrice = isUsingTicket ? 0 : selectedCourse.price
  const totalAmount = coursePrice + travelFee + vehicleFee

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    router.push(
      `/booking/complete?instructor=${instructorId}&date=${date}&time=${time}&total=${totalAmount}&course=${courseIndex}&meetingPoint=${selectedMeetingPoint}`,
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4 -ml-2 gap-2 text-foreground/80 hover:text-foreground">
            <Link href={`/instructor/${instructorId}`}>
              <ArrowLeft className="h-4 w-4" />
              講師プロフィールに戻る
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            予約内容の確認
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-lg">講師情報</CardTitle>
              </CardHeader>
              <CardContent>
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
                    {existingPackage && existingPackage.remainingTickets > 0 && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          残チケット {existingPackage.remainingTickets}枚
                        </span>
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {instructor.area}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Car className="h-3.5 w-3.5 text-primary" />
                      {instructor.carType}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-accent/10 to-transparent">
                <CardTitle className="text-lg">レッスン詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isUsingTicket && (
                  <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 p-4 border border-green-500/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                      <Ticket className="h-6 w-6 text-green-600 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700">チケットを使用します</p>
                      <p className="text-xs text-green-600 mt-1">
                        残チケット: {existingPackage.remainingTickets}枚 → {existingPackage.remainingTickets - 1}枚
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-4 border border-purple-500/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                    <Tag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">選択コース</p>
                    <p className="font-semibold text-foreground">{selectedCourse.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCourse.duration} × {selectedCourse.sessions}回
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 border border-primary/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">初回レッスン日</p>
                    <p className="font-semibold text-foreground">{formatDate(date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 p-4 border border-accent/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">時間</p>
                    <p className="font-semibold text-foreground">
                      {time}〜（{selectedCourse.duration}）
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="meetingPoint">待ち合わせ場所</Label>
                  <Select value={selectedMeetingPoint} onValueChange={setSelectedMeetingPoint}>
                    <SelectTrigger
                      id="meetingPoint"
                      className="w-full border-2 border-primary/10 focus:border-primary/30"
                    >
                      <SelectValue placeholder="待ち合わせ場所を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">指定エリア</div>
                      {instructor.designatedAreas.map((point) => (
                        <SelectItem key={point} value={point}>
                          {point}
                        </SelectItem>
                      ))}
                      {instructor.travelAreas.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                            出張エリア（出張料金 +¥{instructor.travelFee.toLocaleString()}）
                          </div>
                          {instructor.travelAreas.map((point) => (
                            <SelectItem key={point} value={point}>
                              {point}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {isTravelArea && (
                    <p className="text-xs text-amber-600">
                      ※ 出張エリアのため、出張料金¥{instructor.travelFee.toLocaleString()}が加算されます
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="useVehicle"
                      checked={useInstructorVehicle}
                      onCheckedChange={(checked) => setUseInstructorVehicle(checked === true)}
                    />
                    <Label
                      htmlFor="useVehicle"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      教習車を利用する（+¥{instructor.vehicleFee.toLocaleString()}）
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    自家用車をお持ちでない場合は、講師の教習車をご利用いただけます
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  講師へのメッセージ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="message" className="sr-only">
                  メッセージ
                </Label>
                <Textarea
                  id="message"
                  placeholder="練習したい内容や質問など、講師に伝えたいことがあればご記入ください。&#10;例：駐車が苦手なので重点的に練習したいです。"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none border-2 border-primary/10 focus:border-primary/30 rounded-xl"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div>
            <Card className="sticky top-24 border-2 border-primary/20 shadow-xl shadow-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  料金明細
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {selectedCourse.name}
                      {isUsingTicket && (
                        <span className="block text-xs text-green-600 font-medium">（チケット利用）</span>
                      )}
                      {!isUsingTicket && (
                        <span className="text-xs block text-muted-foreground/70">（サービス手数料込み）</span>
                      )}
                    </span>
                    <span className="text-foreground font-medium">
                      {isUsingTicket ? <span className="text-green-600">¥0</span> : `¥${coursePrice.toLocaleString()}`}
                    </span>
                  </div>

                  {travelFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">出張料金</span>
                      <span className="text-foreground font-medium">+¥{travelFee.toLocaleString()}</span>
                    </div>
                  )}

                  {vehicleFee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">教習車使用料</span>
                      <span className="text-foreground font-medium">+¥{vehicleFee.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator className="bg-primary/10" />

                <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                  <span className="font-semibold text-foreground">合計</span>
                  <span className="text-2xl font-bold text-primary">¥{totalAmount.toLocaleString()}</span>
                </div>

                <div className="rounded-xl bg-secondary/50 p-4">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p>お支払いは講習終了後にクレジットカードで決済されます</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 p-4 border border-primary/10">
                  <div className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">キャンセルポリシー</p>
                      {selectedCourse.sessions > 1 ? (
                        <p className="mt-1">コース購入の場合、予約から1週間以内はキャンセル可能です。初回予約確定後はキャンセルできません。</p>
                      ) : (
                        <p className="mt-1">予約確定後のキャンセルはできません。</p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedMeetingPoint}
                >
                  {isSubmitting ? "送信中..." : "予約リクエストを送信"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  予約リクエストを送信すると、利用規約に同意したものとみなされます
                </p>
              </CardContent>
            </Card>
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

export default function BookingConfirmPage() {
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
      <BookingConfirmContent />
    </Suspense>
  )
}
