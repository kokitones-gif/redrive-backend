"use client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  DollarSign,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Bell,
  User,
  LogOut,
  TrendingUp,
  TrendingDown,
  Plus,
  Clock,
} from "lucide-react"
import { bookingRequests, instructorEarnings, instructorMessages, scheduledLessons } from "@/lib/data"
import { useRouter } from "next/navigation"
import { Pen as Yen } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InstructorDashboard() {
  const router = useRouter()
  const currentMonth = instructorEarnings[0]
  const lastMonth = instructorEarnings[1]
  const pendingRequests = bookingRequests.filter((b) => b.status === "pending")

  const unreadMessages = Object.values(instructorMessages).reduce((count, messages) => {
    return count + messages.filter((m) => !m.isRead && m.sender !== "instructor").length
  }, 0)

  const earningsChange = lastMonth
    ? (((currentMonth.totalEarnings - lastMonth.totalEarnings) / lastMonth.totalEarnings) * 100).toFixed(0)
    : 0
  const lessonsChange = lastMonth
    ? (((currentMonth.completedLessons - lastMonth.completedLessons) / lastMonth.completedLessons) * 100).toFixed(0)
    : 0

  // 本日の予定を実際のデータから計算
  const today = new Date()
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  const todaySchedule = scheduledLessons.filter(
    (lesson) => lesson.instructorId === "1" && lesson.date === todayString
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">Re:Drive</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">講師用</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/instructor-dashboard/messages">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">メッセージ</span>
                  {unreadMessages > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push("/instructor-dashboard/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    プロフィール
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/instructor-dashboard/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    設定
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/")}>
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ダッシュボード</h1>
          <p className="text-muted-foreground">講師用管理画面</p>
        </div>

        {/* クイックアクションセクション */}
        <section className="mb-8">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">本日の予定</p>
                  <p className="text-3xl font-bold">{todaySchedule}件</p>
                </div>
                <Clock className="h-12 w-12 opacity-80" />
              </div>
              <Button
                variant="secondary"
                className="w-full mt-4"
                onClick={() => router.push("/instructor-dashboard/schedule")}
              >
                予定を確認
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* 統計セクション */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold">統計情報</h2>
            <p className="text-sm text-muted-foreground">今月のパフォーマンス</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/instructor-dashboard/earnings">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">今月の売上</p>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold text-primary">¥{currentMonth.totalEarnings.toLocaleString()}</p>
                        {lastMonth && (
                          <div
                            className={`flex items-center gap-0.5 text-xs font-medium mb-1 ${Number(earningsChange) >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {Number(earningsChange) >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(Number(earningsChange))}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/instructor-dashboard/reviews">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/40 flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">平均評価</p>
                      <div className="flex items-center gap-3">
                        <p className="text-2xl font-bold text-yellow-500">4.9</p>
                        <p className="text-sm text-muted-foreground">（24件の口コミ）</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* 管理機能セクション */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold">管理機能</h2>
            <p className="text-sm text-muted-foreground">レッスンや予約の管理</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. 予約リクエスト（新規リクエストがあれば最優先） */}
            <Link href="/instructor-dashboard/bookings">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full relative">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-xl">予約リクエスト</h4>
                        {pendingRequests.length > 0 && (
                          <Badge variant="destructive" className="animate-pulse">
                            {pendingRequests.length}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">生徒からの予約を承認・拒否できます</p>
                    </div>
                  </div>
                </CardContent>
                {pendingRequests.length > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}
              </Card>
            </Link>

            {/* 2. スケジュール管理 */}
            <Link href="/instructor-dashboard/schedule">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                        <Calendar className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-2">スケジュール管理</h4>
                      <p className="text-sm text-muted-foreground">空き枠の登録や予定の確認ができます</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 3. メッセージ */}
            <Link href="/instructor-dashboard/messages">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full relative">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                        <MessageSquare className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-xl">メッセージ</h4>
                        {unreadMessages > 0 && <Badge variant="destructive">{unreadMessages}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">生徒とのやり取りを確認できます</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 4. 売上・振込管理 */}
            <Link href="/instructor-dashboard/earnings">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                        <DollarSign className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-2">売上・振込管理</h4>
                      <p className="text-sm text-muted-foreground">収益の確認と振込申請ができます</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 5. プロフィール編集 */}
            <Link href="/instructor-dashboard/profile">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center">
                        <User className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xl mb-2">プロフィール編集</h4>
                      <p className="text-sm text-muted-foreground">自己紹介や対応エリアを編集できます</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 6. メニュー設定 / 料金設定 */}
            <Card
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer h-full"
              onClick={() => router.push("/instructor-dashboard/menu")}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center">
                      <Yen className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xl mb-2">メニュー・料金設定</h4>
                    <p className="text-sm text-muted-foreground">コース内容と料金の管理ができます</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
