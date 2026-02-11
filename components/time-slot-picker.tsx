"use client"

import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
}

interface TimeSlotPickerProps {
  selectedDate: string
  selectedTime: string | null
  onSelectTime: (time: string) => void
}

const generateTimeSlots = (dateString: string): TimeSlot[] => {
  const date = new Date(dateString)
  const dayOfWeek = date.getDay()

  // Base time slots
  const baseSlots = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
  ]

  // Vary availability based on day of week for realistic demo
  const dateNum = date.getDate()
  return baseSlots.map((slot, index) => ({
    ...slot,
    available: (dateNum + index) % 3 !== 0 && (dayOfWeek !== 0 || index < 6),
  }))
}

export function TimeSlotPicker({ selectedDate, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  const timeSlots = generateTimeSlots(selectedDate)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
    return `${month}月${day}日（${weekDay}）`
  }

  const availableCount = timeSlots.filter((s) => s.available).length

  return (
    <div className="rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5 p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          {formatDate(selectedDate)}
        </h3>
        <span className="text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded-full">
          {availableCount}枠空き
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => slot.available && onSelectTime(slot.time)}
            className={cn(
              "rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all",
              !slot.available && "cursor-not-allowed border-muted bg-muted/50 text-muted-foreground/50 line-through",
              slot.available &&
                selectedTime !== slot.time &&
                "cursor-pointer border-primary/20 bg-card text-foreground hover:border-primary hover:bg-primary/10 hover:scale-105",
              selectedTime === slot.time &&
                "border-primary bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md scale-105",
            )}
          >
            {slot.time}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded border-2 border-primary/20 bg-card" />
          予約可能
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded bg-gradient-to-br from-primary to-primary/80" />
          選択中
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-6 rounded border-2 border-muted bg-muted/50" />
          予約不可
        </div>
      </div>
    </div>
  )
}
