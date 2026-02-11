"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, MessageSquare, Calendar, Ticket, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { instructors, coursePackages } from "@/lib/data"

export default function MyInstructorsPage() {
  // テスト用：現在のログインユーザー（山田太郎 = studentId: "1"）
  const currentStudentId = "1"

  // 購入済みのコースパッケージから講師情報を取得
  const myInstructors = coursePackages
    .filter((pkg) => pkg.studentId === currentStudentId)
    .map((pkg) => {
      const instructor = instructors.find((i) => i.id === pkg.instructorId)
      return {
        ...instructor,
        totalLessons: pkg.totalSessions,
        remainingTickets: pkg.remainingTickets,
        usedSessions: pkg.usedSessions,
        lastLesson: new Date(pkg.purchasedAt).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        course: pkg.courseName,
      }
    })
    .filter((i) => i !== undefined)

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
          <div className="mb-8">
            <Link href="/mypage">
              <Button variant="ghost" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                マイページに戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              受講した講師
            </h1>
            <p className="text-muted-foreground">これまで受講した講師から次回の予約を入れられます</p>
          </div>

          {/* 講師リスト */}
          <div className="space-y-4">
            {myInstructors.map((instructor) => (
              <Card key={instructor.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                      <Image
                        src={instructor.avatar || "/placeholder.svg"}
                        alt={instructor.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-xl">{instructor.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{instructor.area}</span>
                          </div>
                        </div>
                        {instructor.remainingTickets > 0 && (
                          <Badge variant="default" className="shrink-0">
                            残り{instructor.remainingTickets}回
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span>
                            {instructor.course} ({instructor.totalLessons - instructor.remainingTickets}/
                            {instructor.totalLessons})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>最終受講: {instructor.lastLesson}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {instructor.remainingTickets > 0 ? (
                          <Link href={`/instructor/${instructor.id}`} className="flex-1">
                            <Button className="w-full">
                              <Calendar className="h-4 w-4 mr-2" />
                              次回予約を入れる
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/instructor/${instructor.id}`} className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent">
                              新しいコースを予約
                            </Button>
                          </Link>
                        )}
                        <Link href={`/messages?instructor=${instructor.name}`}>
                          <Button variant="outline" className="bg-transparent">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
