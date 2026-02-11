"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { scheduledLessons, students } from "@/lib/data"
import {
  Clock,
  Calendar,
  User,
  Phone,
  BookOpen,
  MessageSquare,
  MapPin,
  AlertTriangle,
  Mail,
  CalendarIcon,
  Car,
} from "lucide-react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { useState } from "react"

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const booking = scheduledLessons.find((lesson) => lesson.id === params.id)
  const student = students.find((s) => s.id === booking?.studentId)

  const [isEditingTime, setIsEditingTime] = useState(false)
  const [editingTime, setEditingTime] = useState("10:00")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{ time: string } | null>(null)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)

  if (!booking) {
    notFound()
  }

  const handleUpdateTime = (time: string) => {
    setPendingUpdate({ time })
    setConfirmDialogOpen(true)
  }

  const handleConfirmTimeUpdate = () => {
    if (!pendingUpdate) return

    const { time } = pendingUpdate

    // Update the booking data
    const lessonIndex = scheduledLessons.findIndex((l) => l.id === booking.id)
    if (lessonIndex !== -1) {
      scheduledLessons[lessonIndex].confirmedTime = time
      scheduledLessons[lessonIndex].status = "confirmed"
    }

    setConfirmDialogOpen(false)
    setPendingUpdate(null)
    setIsEditingTime(false)

    // Refresh the page to show updated data
    router.refresh()
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          ← 戻る
        </Button>
      </div>

      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">予約詳細</CardTitle>
              <Badge
                className={
                  booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                }
              >
                {booking.status === "confirmed" ? "✓ 確定" : "○ 仮予約"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Student Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                受講生情報
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setReportDialogOpen(true)} className="text-orange-600">
                    通報する
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBlockDialogOpen(true)} className="text-red-600">
                    ブロックする
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-2xl font-bold text-primary">
                {booking.studentName.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold">{booking.studentName}</p>
                {student && (
                  <p className="text-sm text-muted-foreground">
                    {student.age}歳 • {student.gender === "male" ? "男性" : "女性"}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.studentPhone}</span>
              </div>
              {student?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
              )}
              {student?.address && (
                <div className="flex items-start gap-2 text-sm md:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{student.address}</span>
                </div>
              )}
            </div>
            {student && (
              <div className="border-t pt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">免許タイプ</div>
                    <div className="text-sm font-medium">{student.licenseType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">運転経験</div>
                    <div className="text-sm font-medium">{student.drivingExperience}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">登録日</div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {student.registeredAt
                        ? new Date(student.registeredAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">顧客タイプ</div>
                    <div className="text-sm">
                      <Badge variant={student.customerType === "new" ? "default" : "secondary"}>
                        {student.customerType === "new" ? "新規" : "リピート"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              予約内容
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1 font-semibold">日付</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-700" />
                  <span className="font-bold text-lg text-blue-900">
                    {new Date(booking.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    （{["日", "月", "火", "水", "木", "金", "土"][new Date(booking.date).getDay()]}）
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-1 font-semibold">時間</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-700" />
                  <span className="font-bold text-2xl text-blue-900">{booking.confirmedTime || "--:--"}</span>
                </div>
              </div>
            </div>

            {booking.status === "tentative" && !booking.confirmedTime && (
              <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50/50">
                <div className="text-sm font-semibold text-orange-700 mb-3">時間設定が必要です</div>
                {isEditingTime ? (
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">確定時間を設定</Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        value={editingTime}
                        onChange={(e) => setEditingTime(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleUpdateTime(editingTime)}>
                        保存
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingTime(false)}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-white hover:bg-orange-100"
                    onClick={() => {
                      setIsEditingTime(true)
                      setEditingTime("10:00")
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    時間を設定
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">コース</div>
              <div className="font-semibold">{booking.course}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">料金</div>
              <div className="text-2xl font-bold text-primary">¥{booking.price.toLocaleString()}</div>
            </div>

            {/* 免許タイプ・オプション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">免許タイプ</div>
                <Badge variant={booking.transmissionType === "AT" ? "default" : "secondary"} className="text-sm">
                  {booking.transmissionType === "AT" ? "AT（オートマ）" : "MT（マニュアル）"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">オプション</div>
                <div className="flex flex-wrap gap-2">
                  {booking.useInstructorCar && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <Car className="h-3 w-3 mr-1" />
                      教習車利用
                    </Badge>
                  )}
                  {booking.pickupService && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <MapPin className="h-3 w-3 mr-1" />
                      送迎あり
                    </Badge>
                  )}
                  {!booking.useInstructorCar && !booking.pickupService && (
                    <span className="text-sm text-muted-foreground">なし</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                待ち合わせ場所
              </div>
              <div className="font-semibold">{booking.meetingPoint}</div>
            </div>

            {booking.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  メッセージ
                </div>
                <div className="text-sm text-blue-900">{booking.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1" asChild>
            <Link href="/instructor-dashboard/messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              メッセージを送る
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
            戻る
          </Button>
        </div>
      </div>

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

      <AlertDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>受講生を通報しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {booking.studentName}さんを通報します。運営チームが内容を確認し、適切な対応を行います。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setReportDialogOpen(false)
              }}
              className="bg-orange-600 hover:bg-orange-700"
            >
              通報する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>受講生をブロックしますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {booking.studentName}
              さんをブロックすると、この受講生からの予約リクエストを受け取らなくなります。この操作は後から解除できます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setBlockDialogOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              ブロックする
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
