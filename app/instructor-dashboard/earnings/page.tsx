"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Users,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { instructorEarnings, students } from "@/lib/data"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function InstructorEarnings() {
  const [selectedMonth, setSelectedMonth] = useState(instructorEarnings[0])
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const itemsPerPage = 10

  const totalPendingAmount = instructorEarnings.reduce((sum, earning) => sum + earning.pendingAmount, 0)

  const statistics = useMemo(() => {
    const studentNamesInMonth = selectedMonth.lessons.map((lesson) => lesson.studentName)
    const studentsInMonth = students.filter((s) => studentNamesInMonth.includes(s.name))

    const totalLessons = selectedMonth.completedLessons

    const customerTypeData = [
      { name: "新規", value: studentsInMonth.filter((s) => s.customerType === "new").length, color: "#10b981" },
      { name: "リピート", value: studentsInMonth.filter((s) => s.customerType === "repeat").length, color: "#3b82f6" },
    ]

    const ageData = [
      { name: "20代", value: studentsInMonth.filter((s) => s.age >= 20 && s.age < 30).length, color: "#10b981" },
      { name: "30代", value: studentsInMonth.filter((s) => s.age >= 30 && s.age < 40).length, color: "#f59e0b" },
      { name: "40代", value: studentsInMonth.filter((s) => s.age >= 40 && s.age < 50).length, color: "#8b5cf6" },
    ]

    return { totalLessons, customerTypeData, ageData }
  }, [selectedMonth])

  const handleWithdrawalRequest = () => {
    setIsDialogOpen(false)
    toast({
      title: "振込申請を行いました",
      description: "振込は10日以内に完了します。",
      duration: 5000,
    })
  }

  const totalPages = Math.ceil(selectedMonth.lessons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLessons = selectedMonth.lessons.slice(startIndex, endIndex)

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
              <h1 className="text-xl font-bold">売上・振込管理</h1>
              <p className="text-sm text-muted-foreground">収益の確認と振込申請</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">表示期間</label>
                  <Select
                    value={selectedMonth.month}
                    onValueChange={(value) => {
                      const month = instructorEarnings.find((e) => e.month === value)
                      if (month) setSelectedMonth(month)
                    }}
                  >
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {instructorEarnings.map((earning) => (
                        <SelectItem key={earning.month} value={earning.month}>
                          {earning.month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">今月の売上合計</p>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary">¥{selectedMonth.totalEarnings.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">{selectedMonth.completedLessons}レッスン完了</p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">振込申請可能額</p>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500">¥{totalPendingAmount.toLocaleString()}</p>
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="w-full mt-4" size="sm">
                    振込申請する
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>振込申請の確認</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <div>以下の金額で振込申請を行いますか？</div>
                      <div className="text-2xl font-bold text-primary mt-4">¥{totalPendingAmount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground mt-2">振込は申請後10日以内に完了します。</div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleWithdrawalRequest}>確定</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">振込済み金額</p>
                <Download className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">¥{selectedMonth.withdrawnAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">次回振込: 12/25</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Information Section */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle>統計情報 - {selectedMonth.month}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Total Lessons */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">講習回数</h3>
                </div>
                <p className="text-5xl font-bold text-primary mb-2">{statistics.totalLessons}</p>
                <p className="text-sm text-muted-foreground">完了レッスン</p>
              </div>

              {/* Customer Type Ratio */}
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">新規・リピート比率</h3>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie
                      data={statistics.customerTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statistics.customerTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {statistics.customerTypeData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Ratio */}
              <div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">受講生の年齢比</h3>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={statistics.ageData} cx="50%" cy="50%" outerRadius={50} fill="#8884d8" dataKey="value">
                      {statistics.ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-2">
                  {statistics.ageData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-xs">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson History */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>レッスン履歴 - {selectedMonth.month}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentLessons.length > 0 ? (
              <>
                <div className="space-y-3">
                  {currentLessons.map((lesson, index) => (
                    <Dialog key={index}>
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedLesson(lesson)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{lesson.date.split("/")[1]}</p>
                              <p className="text-xs text-muted-foreground">{lesson.date.split("/")[0]}月</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold">{lesson.studentName}</p>
                                {lesson.status === "completed" ? (
                                  <Badge variant="default" className="bg-green-500">
                                    完了
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-gray-400 text-white">
                                    キャンセル
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{lesson.course}</p>
                            </div>
                          </div>
                          <p className="font-bold text-lg">¥{lesson.amount.toLocaleString()}</p>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>レッスン詳細</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">受講生</p>
                              <p className="font-semibold">{lesson.studentName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">日時</p>
                              <p className="font-semibold">{lesson.date}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">コース</p>
                              <p className="font-semibold">{lesson.course}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">料金</p>
                              <p className="font-semibold">¥{lesson.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">ステータス</p>
                              {lesson.status === "completed" ? (
                                <Badge variant="default" className="bg-green-500">
                                  完了
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-400 text-white">
                                  キャンセル
                                </Badge>
                              )}
                            </div>
                            {lesson.rating && (
                              <div>
                                <p className="text-sm text-muted-foreground">評価</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < lesson.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {lesson.review && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">受講生からのレビュー</p>
                              <p className="text-sm p-3 bg-muted rounded-lg">{lesson.review}</p>
                            </div>
                          )}
                          {lesson.bookingId && (
                            <Link href={`/instructor-dashboard/bookings/detail/${lesson.bookingId}`}>
                              <Button variant="outline" className="w-full bg-transparent">
                                予約詳細を見る
                              </Button>
                            </Link>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      前へ
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>この月のレッスン履歴はありません</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
