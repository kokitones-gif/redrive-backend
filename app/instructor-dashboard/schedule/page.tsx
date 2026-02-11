"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, Calendar, MapPin } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { scheduledLessons, type DaySchedule, type TimeSlotStatus, type ScheduledLesson } from "@/lib/data"
import { Input } from "@/components/ui/input"

const formatDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function ScheduleManagement() {
  const currentInstructorId = "1"
  const [currentDate, setCurrentDate] = useState(new Date())

  const todayString = formatDateString(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(todayString)

  const [schedules, setSchedules] = useState<Map<string, DaySchedule>>(new Map())

  const [dateCapacities, setDateCapacities] = useState<
    Map<string, { morning: number; afternoon: number; evening: number }>
  >(new Map())
  const [dateEnabledSlots, setDateEnabledSlots] = useState<
    Map<string, { morning: boolean; afternoon: boolean; evening: boolean }>
  >(new Map())

  const [lessonsData, setLessonsData] = useState<ScheduledLesson[]>(scheduledLessons)

  const [availableDays, setAvailableDays] = useState<string[]>(["日", "月", "火", "水", "木", "金", "土"])
  const [availableDaysDialogOpen, setAvailableDaysDialogOpen] = useState(false)

  const [viewMode, setViewMode] = useState<"month" | "week" | "twoWeek">("twoWeek")
  const [twoWeekStart, setTwoWeekStart] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const maxScheduleDate = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const max = new Date(today)
    max.setMonth(max.getMonth() + 4)
    return max
  }, [])

  const canNavigatePrev = useMemo(() => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return prevMonth >= new Date(today.getFullYear(), today.getMonth(), 1)
  }, [currentDate])

  const canNavigateNext = useMemo(() => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    return nextMonth <= maxScheduleDate
  }, [currentDate, maxScheduleDate])

  const getDateCapacity = (dateString: string) => {
    return dateCapacities.get(dateString) || { morning: 2, afternoon: 2, evening: 2 }
  }

  const getDateEnabled = (dateString: string) => {
    return dateEnabledSlots.get(dateString) || { morning: true, afternoon: true, evening: true }
  }

  const calculateTimeSlotStatus = (
    dateString: string,
    timeSlot: "morning" | "afternoon" | "evening",
  ): TimeSlotStatus => {
    const lessons = lessonsData.filter(
      (lesson) =>
        lesson.instructorId === currentInstructorId && lesson.date === dateString && lesson.timeSlot === timeSlot,
    )

    const capacity = getDateCapacity(dateString)[timeSlot]
    const confirmedCount = lessons.filter((l) => l.status === "confirmed").length
    const tentativeCount = lessons.filter((l) => l.status === "tentative").length
    const totalCount = confirmedCount + tentativeCount

    if (confirmedCount >= capacity) {
      return "booked"
    }
    if (totalCount >= capacity) {
      return "tentative"
    }
    return "available"
  }

  const getSchedule = (dateString: string): DaySchedule => {
    const existingSchedule = schedules.get(dateString)

    if (existingSchedule) {
      return existingSchedule
    }

    const enabled = getDateEnabled(dateString)

    return {
      date: dateString,
      morning: enabled.morning ? calculateTimeSlotStatus(dateString, "morning") : "booked",
      afternoon: enabled.afternoon ? calculateTimeSlotStatus(dateString, "afternoon") : "booked",
      evening: enabled.evening ? calculateTimeSlotStatus(dateString, "evening") : "booked",
      isHoliday: false,
    }
  }

  const updateSchedule = (dateString: string, updates: Partial<DaySchedule>) => {
    const newSchedules = new Map(schedules)
    const current = getSchedule(dateString)
    newSchedules.set(dateString, { ...current, ...updates })
    setSchedules(newSchedules)
  }

  const getStatusIcon = (status: TimeSlotStatus) => {
    switch (status) {
      case "available":
        return "○"
      case "tentative":
        return "△"
      case "booked":
        return "×"
    }
  }

  const getStatusColor = (status: TimeSlotStatus) => {
    switch (status) {
      case "available":
        return "text-green-600"
      case "tentative":
        return "text-orange-500"
      case "booked":
        return "text-red-500"
    }
  }

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

  // 2週間分の日付を生成
  const twoWeekDates = useMemo(() => {
    const dates: Date[] = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(twoWeekStart)
      date.setDate(twoWeekStart.getDate() + i)
      dates.push(date)
    }
    return dates
  }, [twoWeekStart])

  const canGoTwoWeekPrev = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return twoWeekStart > today
  }, [twoWeekStart])

  const canGoTwoWeekNext = useMemo(() => {
    const twoWeeksLater = new Date(twoWeekStart)
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)
    return twoWeeksLater <= maxScheduleDate
  }, [twoWeekStart, maxScheduleDate])

  const goToPreviousTwoWeeks = () => {
    const newStart = new Date(twoWeekStart)
    newStart.setDate(newStart.getDate() - 14)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (newStart < today) {
      setTwoWeekStart(today)
    } else {
      setTwoWeekStart(newStart)
    }
  }

  const goToNextTwoWeeks = () => {
    const newStart = new Date(twoWeekStart)
    newStart.setDate(newStart.getDate() + 14)
    if (newStart <= maxScheduleDate) {
      setTwoWeekStart(newStart)
    }
  }

  const filteredBookings = selectedDate
    ? lessonsData.filter((lesson) => lesson.instructorId === currentInstructorId && lesson.date === selectedDate)
    : []

  const [bookingSortOrder, setBookingSortOrder] = useState<"asc" | "desc">("asc")

  const sortedFilteredBookings = [...filteredBookings].sort((a, b) => {
    const getTimeValue = (booking: (typeof filteredBookings)[0]) => {
      if (booking.confirmedTime) {
        const [hours, minutes] = booking.confirmedTime.split(":").map(Number)
        return hours * 60 + minutes
      }
      // Default time values for time slots
      const timeSlotValues = { morning: 600, afternoon: 840, evening: 1080 } // 10:00, 14:00, 18:00
      return timeSlotValues[booking.timeSlot as keyof typeof timeSlotValues] || 0
    }

    const timeA = getTimeValue(a)
    const timeB = getTimeValue(b)
    return bookingSortOrder === "asc" ? timeA - timeB : timeB - timeA
  })

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editingTime, setEditingTime] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<{ lessonId: string; time: string } | null>(null)

  const handleConfirmLesson = (lessonId: string) => {
    // 実際にはAPIを呼び出してデータを更新
    alert("予約を確定しました")
  }

  const handleUpdateTime = (lessonId: string, time: string) => {
    setPendingUpdate({ lessonId, time })
    setConfirmDialogOpen(true)
  }

  const handleConfirmTimeUpdate = () => {
    if (!pendingUpdate) return

    const { lessonId, time } = pendingUpdate

    setLessonsData((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              confirmedTime: time,
              status: "confirmed" as const,
            }
          : lesson,
      ),
    )

    setEditingLessonId(null)
    setConfirmDialogOpen(false)
    setPendingUpdate(null)
    setEditingTime("")
  }

  const handleDayToggle = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSaveAvailableDays = () => {
    const unavailableDays = ["日", "月", "火", "水", "木", "金", "土"].filter((d) => !availableDays.includes(d))

    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()

    // 全ての日付の休業日設定をクリア
    for (let day = 1; day <= lastDay; day++) {
      const dateString = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const date = new Date(currentYear, currentMonth - 1, day)
      const dayOfWeek = date.getDay()
      const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
      const dayName = dayNames[dayOfWeek]

      if (unavailableDays.includes(dayName)) {
        // 対応していない曜日のみ休業日に設定
        updateSchedule(dateString, {
          isHoliday: true,
          morning: "booked",
          afternoon: "booked",
          evening: "booked",
        })
        updateDateEnabled(dateString, { morning: false, afternoon: false, evening: false })
      } else {
        // 対応している曜日は休業日フラグをクリア
        updateSchedule(dateString, { isHoliday: false })
        updateDateEnabled(dateString, { morning: true, afternoon: true, evening: true })
      }
    }

    setAvailableDaysDialogOpen(false)
    alert(
      `対応曜日を保存しました。${unavailableDays.length > 0 ? `${unavailableDays.join("、")}曜日を休業日に設定しました。` : ""}`,
    )
  }

  // formatDateString is now defined above

  const getWeekDates = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay())
    const dates = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      dates.push(d)
    }
    return dates
  }

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])

  const updateDateEnabled = (
    dateString: string,
    updates: Partial<{ morning: boolean; afternoon: boolean; evening: boolean }>,
  ) => {
    setDateEnabledSlots((prev) => {
      const current = prev.get(dateString) || { morning: true, afternoon: true, evening: true }
      return new Map(prev).set(dateString, { ...current, ...updates })
    })
  }

  const updateDateCapacity = (
    dateString: string,
    updates: Partial<{ morning: number; afternoon: number; evening: number }>,
  ) => {
    setDateCapacities((prev) => {
      const current = prev.get(dateString) || { morning: 2, afternoon: 2, evening: 2 }
      return new Map(prev).set(dateString, { ...current, ...updates })
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/instructor-dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">スケジュール管理</h1>
              <p className="text-xs text-muted-foreground hidden md:block mt-0.5">4ヶ月先まで設定可能</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              {/* モバイル用: 2週間/月 切り替え */}
              <div className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "twoWeek" ? "month" : "twoWeek")}
                  className="text-xs px-2 h-8"
                >
                  {viewMode === "twoWeek" ? "月" : "2週"}
                </Button>
              </div>
              {/* PC用: 週/月 切り替え */}
              <div className="hidden md:block">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}
                  className="text-sm px-3 h-8"
                >
                  {viewMode === "month" ? "週" : "月"}
                </Button>
              </div>

              <Dialog open={availableDaysDialogOpen} onOpenChange={setAvailableDaysDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 md:gap-2 bg-transparent text-xs md:text-sm px-2 md:px-3 h-8">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">対応曜日</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>対応曜日設定</DialogTitle>
                    <DialogDescription>指導可能な曜日を選択してください</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-4">
                    {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                      <div
                        key={day}
                        className="flex items-center space-x-3 p-3 rounded-lg border bg-background hover:bg-secondary/50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={availableDays.includes(day)}
                          onChange={() => handleDayToggle(day)}
                          className="rounded h-4 w-4"
                        />
                        <Label htmlFor={`day-${day}`} className="font-normal cursor-pointer flex-1">
                          {day}曜日
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <div className="flex-1 text-sm text-muted-foreground">
                      選択中: {availableDays.map((d) => `${d}曜日`).join(", ")}
                    </div>
                    <Button onClick={handleSaveAvailableDays}>保存</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* 凡例 - PC版のみ */}
              <div className="hidden lg:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-green-600 font-bold">○</span>
                  <span>空き</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500 font-bold">△</span>
                  <span>仮予約</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500 font-bold">×</span>
                  <span>満席</span>
                </div>
              </div>
            </div>
          </div>
          {/* 凡例 - モバイル版 */}
          <div className="flex lg:hidden items-center justify-center gap-4 text-xs mt-2 pt-2 border-t">
            <div className="flex items-center gap-1">
              <span className="text-green-600 font-bold">○</span>
              <span>空き</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-orange-500 font-bold">△</span>
              <span>仮</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500 font-bold">×</span>
              <span>満席</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 md:px-4 py-4 md:py-6">
        <div className="grid lg:grid-cols-[1fr,400px] gap-4 md:gap-6">
          {/* カレンダー */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (viewMode === "twoWeek") {
                      goToPreviousTwoWeeks()
                    } else if (viewMode === "week") {
                      const newDate = new Date(currentDate)
                      newDate.setDate(currentDate.getDate() - 7)
                      setCurrentDate(newDate)
                    } else {
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate()),
                      )
                    }
                  }}
                  disabled={viewMode === "twoWeek" ? !canGoTwoWeekPrev : !canNavigatePrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">戻る</span>
                </Button>
                <CardTitle>
                  {viewMode === "twoWeek" ? (
                    <div className="text-center">
                      <p className="text-base font-bold">
                        {twoWeekDates[0]?.getFullYear()}年{twoWeekDates[0]?.getMonth() + 1}月
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {twoWeekDates[0]?.getMonth() + 1}/{twoWeekDates[0]?.getDate()} - {twoWeekDates[13]?.getMonth() + 1}/{twoWeekDates[13]?.getDate()}
                      </p>
                    </div>
                  ) : viewMode === "week" ? (
                    <span className="text-base md:text-xl">
                      {weekDates[0].getMonth() + 1}月{weekDates[0].getDate()}日 〜 {weekDates[6].getMonth() + 1}月
                      {weekDates[6].getDate()}日
                    </span>
                  ) : (
                    <>
                      {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
                    </>
                  )}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (viewMode === "twoWeek") {
                      goToNextTwoWeeks()
                    } else if (viewMode === "week") {
                      const newDate = new Date(currentDate)
                      newDate.setDate(currentDate.getDate() + 7)
                      setCurrentDate(newDate)
                    } else {
                      setCurrentDate(
                        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()),
                      )
                    }
                  }}
                  disabled={viewMode === "twoWeek" ? !canGoTwoWeekNext : !canNavigateNext}
                >
                  <span className="mr-1 hidden sm:inline">次へ</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === "twoWeek" ? (
                // 2週間表示モード（モバイル向け）
                <div className="space-y-4">
                  {[0, 1].map((weekIndex) => {
                    const weekDates = twoWeekDates.slice(weekIndex * 7, (weekIndex + 1) * 7)
                    if (weekDates.length === 0) return null

                    return (
                      <div key={weekIndex}>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="p-1.5 text-xs font-bold text-muted-foreground bg-muted/50 border border-border rounded-tl-lg w-12">
                                時間
                              </th>
                              {weekDates.map((date, index) => {
                                const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                const isToday = date.getTime() === today.getTime()
                                return (
                                  <th
                                    key={index}
                                    className={`p-1.5 text-xs font-bold bg-muted/50 border border-border ${
                                      index === weekDates.length - 1 ? "rounded-tr-lg" : ""
                                    } ${
                                      date.getDay() === 0
                                        ? "text-red-500"
                                        : date.getDay() === 6
                                          ? "text-blue-500"
                                          : "text-foreground"
                                    } ${isToday ? "bg-orange-100" : ""}`}
                                  >
                                    <div className="flex flex-col items-center">
                                      <span>{dayOfWeek}</span>
                                      <span className={isToday ? "font-bold" : ""}>{date.getDate()}</span>
                                    </div>
                                  </th>
                                )
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { id: "morning", label: "午前" },
                              { id: "afternoon", label: "昼" },
                              { id: "evening", label: "午後" },
                            ].map((timeSlot, rowIndex) => (
                              <tr key={timeSlot.id}>
                                <td
                                  className={`p-1.5 text-xs font-bold text-muted-foreground bg-muted/50 border border-border ${
                                    rowIndex === 2 ? "rounded-bl-lg" : ""
                                  }`}
                                >
                                  {timeSlot.label}
                                </td>
                                {weekDates.map((date, colIndex) => {
                                  const dateStr = formatDateString(date)
                                  const schedule = getSchedule(dateStr)
                                  const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
                                  const dayName = dayNames[date.getDay()]
                                  const isDayUnavailable = !availableDays.includes(dayName)
                                  const isHoliday = schedule.isHoliday || isDayUnavailable
                                  const status = isHoliday ? "booked" : schedule[timeSlot.id as keyof DaySchedule] as TimeSlotStatus
                                  const isSelected = selectedDate === dateStr

                                  return (
                                    <td
                                      key={colIndex}
                                      className={`border border-border ${
                                        rowIndex === 2 && colIndex === weekDates.length - 1
                                          ? "rounded-br-lg"
                                          : ""
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`w-full h-10 flex items-center justify-center text-lg font-bold transition-all ${
                                          isHoliday
                                            ? "bg-blue-50 text-blue-400"
                                            : isSelected
                                              ? "bg-primary/20 ring-2 ring-primary"
                                              : "bg-background hover:bg-muted/50"
                                        }`}
                                      >
                                        {isHoliday ? (
                                          <span className="text-blue-400 text-sm">-</span>
                                        ) : (
                                          <span className={getStatusColor(status)}>{getStatusIcon(status)}</span>
                                        )}
                                      </button>
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  })}
                </div>
              ) : viewMode === "week" ? (
                // 週表示モード
                <>
                  {/* 曜日ヘッダー */}
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
                    {weekDays.map((day, index) => (
                      <div
                        key={day}
                        className={`text-center text-xs md:text-sm font-bold py-1 md:py-2 ${
                          index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 週カレンダーグリッド */}
                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {weekDates.map((date) => {
                      const dateString = formatDateString(date)
                      const schedule = getSchedule(dateString)
                      const isSelected = selectedDate === dateString
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const isToday = date.getTime() === today.getTime()
                      const dayOfWeek = date.getDay()
                      const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
                      const dayName = dayNames[dayOfWeek]
                      const isDayUnavailable = !availableDays.includes(dayName)

                      if (schedule.isHoliday || isDayUnavailable) {
                        return (
                          <button
                            key={dateString}
                            type="button"
                            onClick={() => setSelectedDate(dateString)}
                            className={`
                              relative p-1.5 md:p-2 rounded-lg border-2 transition-all min-h-[70px] md:min-h-[100px]
                              ${isSelected ? "bg-blue-100 border-blue-500" : "bg-blue-50 border-blue-200"}
                              ${!isPast && "hover:border-blue-400"}
                              ${isToday ? "ring-2 ring-orange-500 ring-offset-1" : ""}
                            `}
                          >
                            <div className={`text-xs md:text-sm font-bold ${dayOfWeek === 0 ? "text-red-500" : ""}`}>
                              {date.getDate()}
                            </div>
                            <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-blue-600">休</div>
                            {isToday && (
                              <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                                <span className="flex h-1.5 w-1.5 md:h-2 md:w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-orange-500"></span>
                                </span>
                              </div>
                            )}
                          </button>
                        )
                      }

                      return (
                        <button
                          key={dateString}
                          type="button"
                          onClick={() => setSelectedDate(dateString)}
                          className={`
                            relative p-1.5 md:p-2 rounded-lg border-2 transition-all min-h-[70px] md:min-h-[100px] text-left
                            ${isSelected ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}
                            ${isPast && "opacity-50"}
                            ${isToday ? "ring-2 ring-orange-500 ring-offset-1 bg-orange-50" : ""}
                          `}
                        >
                          <div className={`text-xs md:text-sm font-bold mb-0.5 md:mb-1 ${dayOfWeek === 0 ? "text-red-500" : ""}`}>
                            {date.getDate()}
                          </div>
                          <div className="space-y-0 md:space-y-0.5 text-[10px] md:text-xs">
                            <div className={`${getStatusColor(schedule.morning)}`}>
                              {getStatusIcon(schedule.morning)}
                            </div>
                            <div className={`${getStatusColor(schedule.afternoon)}`}>
                              {getStatusIcon(schedule.afternoon)}
                            </div>
                            <div className={`${getStatusColor(schedule.evening)}`}>
                              {getStatusIcon(schedule.evening)}
                            </div>
                          </div>
                          {isToday && (
                            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                              <span className="flex h-1.5 w-1.5 md:h-2 md:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-orange-500"></span>
                              </span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : (
                // 月表示モード（既存のコード）
                <>
                  {/* 曜日ヘッダー */}
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
                    {weekDays.map((day, index) => (
                      <div
                        key={day}
                        className={`text-center text-xs md:text-sm font-bold py-1 md:py-2 ${
                          index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* カレンダーグリッド */}
                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {Array.from({
                      length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(),
                    }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({
                      length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
                    }).map((_, i) => {
                      const day = i + 1
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                      const dateString = formatDateString(date)
                      const schedule = getSchedule(dateString)
                      const isSelected = selectedDate === dateString
                      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      const isToday = date.getTime() === today.getTime()
                      const dayOfWeek = date.getDay()
                      const dayNames = ["日", "月", "火", "水", "木", "金", "土"]
                      const dayName = dayNames[dayOfWeek]

                      const isDayUnavailable = !availableDays.includes(dayName)

                      if (schedule.isHoliday || isDayUnavailable) {
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => setSelectedDate(dateString)}
                            className={`
                              relative p-1 md:p-2 rounded-lg border-2 transition-all min-h-[60px] md:min-h-[80px]
                              ${isSelected ? "bg-blue-100 border-blue-500" : "bg-blue-50 border-blue-200"}
                              ${!isPast && "hover:border-blue-400"}
                              ${isToday ? "ring-2 ring-orange-500 ring-offset-1" : ""}
                            `}
                          >
                            <div className={`text-xs md:text-sm font-bold ${dayOfWeek === 0 ? "text-red-500" : ""}`}>{day}</div>
                            <div className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-blue-600">休</div>
                            {isToday && (
                              <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                                <span className="flex h-1.5 w-1.5 md:h-2 md:w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-orange-500"></span>
                                </span>
                              </div>
                            )}
                          </button>
                        )
                      }

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedDate(dateString)}
                          className={`
                            relative p-1 md:p-2 rounded-lg border-2 transition-all min-h-[60px] md:min-h-[80px] text-left
                            ${isSelected ? "bg-primary/10 border-primary" : "border-border hover:border-primary/50"}
                            ${isPast && "opacity-50"}
                            ${isToday ? "ring-2 ring-orange-500 ring-offset-1 bg-orange-50" : ""}
                          `}
                        >
                          <div className={`text-xs md:text-sm font-bold mb-0.5 md:mb-1 ${dayOfWeek === 0 ? "text-red-500" : ""}`}>{day}</div>
                          <div className="space-y-0 md:space-y-0.5 text-[10px] md:text-xs">
                            <div className={`${getStatusColor(schedule.morning)}`}>
                              {getStatusIcon(schedule.morning)}
                            </div>
                            <div className={`${getStatusColor(schedule.afternoon)}`}>
                              {getStatusIcon(schedule.afternoon)}
                            </div>
                            <div className={`${getStatusColor(schedule.evening)}`}>
                              {getStatusIcon(schedule.evening)}
                            </div>
                          </div>
                          {isToday && (
                            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                              <span className="flex h-1.5 w-1.5 md:h-2 md:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-orange-500"></span>
                              </span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 右パネル */}
          <div className="lg:col-span-1">
            {selectedDate && (
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="bookings" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="bookings">予約リスト</TabsTrigger>
                      <TabsTrigger value="availability">空き設定</TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">予約リスト</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBookingSortOrder(bookingSortOrder === "asc" ? "desc" : "asc")}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {bookingSortOrder === "asc" ? "時間順 ↑" : "時間順 ↓"}
                        </Button>
                      </div>

                      {sortedFilteredBookings.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">予約はありません</p>
                      ) : (
                        sortedFilteredBookings.map((booking) => {
                          const timeSlotLabel = booking.timeSlot === "morning" ? "午前" : booking.timeSlot === "afternoon" ? "昼" : "午後"
                          
                          return (
                            <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                {/* Header: Status Badge + Time */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        booking.status === "confirmed"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-orange-100 text-orange-700"
                                      }`}
                                    >
                                      {booking.status === "confirmed" ? "確定" : "仮予約"}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{timeSlotLabel}</span>
                                  </div>
                                  {booking.confirmedTime ? (
                                    <span className="text-sm font-medium">{booking.confirmedTime}</span>
                                  ) : (
                                    <span className="text-xs text-orange-600 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      時間未設定
                                    </span>
                                  )}
                                </div>

                                {/* Student Name + Avatar + Price */}
                                <Link
                                  href={`/instructor-dashboard/schedule/booking-detail/${booking.id}`}
                                  className="flex items-center gap-3 mb-3"
                                >
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                                    {booking.studentName.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-bold text-base truncate">{booking.studentName}</div>
                                    <div className="text-xs text-muted-foreground truncate">{booking.course}</div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <div className="font-bold text-primary">¥{booking.price.toLocaleString()}</div>
                                  </div>
                                </Link>

                                {/* Location */}
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3 bg-muted/30 rounded-lg px-3 py-2">
                                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{booking.meetingPoint}</span>
                                </div>

                                {/* Notes */}
                                {booking.notes && (
                                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                                    <div className="text-xs text-muted-foreground mb-1">メッセージ</div>
                                    <div className="text-sm leading-relaxed">{booking.notes}</div>
                                  </div>
                                )}

                                {/* Actions for tentative bookings */}
                                {booking.status === "tentative" && (
                                  <div className="space-y-2">
                                    {editingLessonId === booking.id ? (
                                      <div className="space-y-2">
                                        <Input
                                          type="time"
                                          value={editingTime}
                                          onChange={(e) => setEditingTime(e.target.value)}
                                          className="w-full"
                                        />
                                        <div className="flex gap-2">
                                          <Button size="sm" className="flex-1" onClick={() => handleUpdateTime(booking.id, editingTime)}>
                                            保存
                                          </Button>
                                          <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => setEditingLessonId(null)}>
                                            キャンセル
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full bg-transparent"
                                        onClick={() => {
                                          setEditingLessonId(booking.id)
                                          setEditingTime("10:00")
                                        }}
                                      >
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        時間設定
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })
                      )}
                    </TabsContent>

                    <TabsContent value="availability" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="text-sm font-medium">受付枠設定</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>午前の受付枠</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={getDateCapacity(selectedDate).morning}
                                disabled={!getDateEnabled(selectedDate).morning}
                                onChange={(e) =>
                                  updateDateCapacity(selectedDate, { morning: Number.parseInt(e.target.value) || 1 })
                                }
                                className="w-20"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>昼の受付枠</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={getDateCapacity(selectedDate).afternoon}
                                disabled={!getDateEnabled(selectedDate).afternoon}
                                onChange={(e) =>
                                  updateDateCapacity(selectedDate, { afternoon: Number.parseInt(e.target.value) || 1 })
                                }
                                className="w-20"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>午後の受付枠</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={getDateCapacity(selectedDate).evening}
                                disabled={!getDateEnabled(selectedDate).evening}
                                onChange={(e) =>
                                  updateDateCapacity(selectedDate, { evening: Number.parseInt(e.target.value) || 1 })
                                }
                                className="w-20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                          <Label htmlFor="morning" className="text-base font-medium">
                            午前
                          </Label>
                          <Switch
                            id="morning"
                            checked={getDateEnabled(selectedDate).morning}
                            disabled={getSchedule(selectedDate).isHoliday}
                            onCheckedChange={(checked) => {
                              updateDateEnabled(selectedDate, { morning: checked })
                              if (!checked) {
                                updateSchedule(selectedDate, { morning: "booked" })
                              } else {
                                updateSchedule(selectedDate, {
                                  morning: calculateTimeSlotStatus(selectedDate, "morning"),
                                })
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                          <Label htmlFor="afternoon" className="text-base font-medium">
                            昼
                          </Label>
                          <Switch
                            id="afternoon"
                            checked={getDateEnabled(selectedDate).afternoon}
                            disabled={getSchedule(selectedDate).isHoliday}
                            onCheckedChange={(checked) => {
                              updateDateEnabled(selectedDate, { afternoon: checked })
                              if (!checked) {
                                updateSchedule(selectedDate, { afternoon: "booked" })
                              } else {
                                updateSchedule(selectedDate, {
                                  afternoon: calculateTimeSlotStatus(selectedDate, "afternoon"),
                                })
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b">
                          <Label htmlFor="evening" className="text-base font-medium">
                            午後
                          </Label>
                          <Switch
                            id="evening"
                            checked={getDateEnabled(selectedDate).evening}
                            disabled={getSchedule(selectedDate).isHoliday}
                            onCheckedChange={(checked) => {
                              updateDateEnabled(selectedDate, { evening: checked })
                              if (!checked) {
                                updateSchedule(selectedDate, { evening: "booked" })
                              } else {
                                updateSchedule(selectedDate, {
                                  evening: calculateTimeSlotStatus(selectedDate, "evening"),
                                })
                              }
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between py-3">
                          <Label htmlFor="holiday" className="text-base font-medium">
                            休業日に設定
                          </Label>
                          <Switch
                            id="holiday"
                            checked={getSchedule(selectedDate).isHoliday}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateDateEnabled(selectedDate, { morning: false, afternoon: false, evening: false })
                                updateSchedule(selectedDate, {
                                  isHoliday: checked,
                                  morning: "booked",
                                  afternoon: "booked",
                                  evening: "booked",
                                })
                              } else {
                                updateSchedule(selectedDate, { isHoliday: checked })
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button className="mt-4 px-8">保存</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

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
    </div>
  )
}
