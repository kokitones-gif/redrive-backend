"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AvailabilityCalendarProps {
  availableDates: string[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
  timeSlotSectionId?: string
}

export function AvailabilityCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
  timeSlotSectionId,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days: (Date | null)[] = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }

    return days
  }, [currentMonth])

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const isAvailable = (date: Date) => {
    return availableDates.includes(formatDateString(date))
  }

  const isPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (dateString: string) => {
    onSelectDate(dateString)

    if (timeSlotSectionId) {
      setTimeout(() => {
        const element = document.getElementById(timeSlotSectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"]

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-secondary/20 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="hover:bg-primary/10">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-bold text-foreground">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </h3>
        <Button variant="ghost" size="icon" onClick={goToNextMonth} className="hover:bg-primary/10">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              "py-2 text-xs font-bold",
              i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground",
            )}
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />
          }

          const dateString = formatDateString(date)
          const available = isAvailable(date)
          const past = isPast(date)
          const isSelected = selectedDate === dateString
          const dayOfWeek = date.getDay()
          const isDisabled = !available || past

          return (
            <button
              key={dateString}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && handleDateClick(dateString)}
              className={cn(
                "relative aspect-square rounded-xl text-sm font-medium transition-all",
                "flex items-center justify-center",
                past && "text-muted-foreground/40 cursor-not-allowed",
                !past && !available && "text-muted-foreground cursor-not-allowed",
                !past && available && "cursor-pointer hover:bg-primary/20 hover:scale-105 active:scale-95",
                !past && available && dayOfWeek === 0 && "text-red-500",
                !past && available && dayOfWeek === 6 && "text-blue-500",
                isSelected &&
                  "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md hover:from-primary/90 hover:to-primary/70",
              )}
            >
              {date.getDate()}
              {available && !past && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-accent shadow-sm" />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-sm" />
          予約可能
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-sm" />
          選択中
        </div>
      </div>
    </div>
  )
}
