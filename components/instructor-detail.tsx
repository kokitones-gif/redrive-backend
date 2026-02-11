"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Car,
  Award,
  MessageCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CoursePrice, Instructor, CoursePackage } from "@/lib/data"
import { coursePackages } from "@/lib/data"

interface InstructorDetailProps {
  instructor: Instructor
}

export function InstructorDetail({ instructor }: InstructorDetailProps) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<CoursePrice | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<"morning" | "afternoon" | "evening" | null>(null)
  const [useInstructorVehicle, setUseInstructorVehicle] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // テスト用：現在のログインユーザー（山田太郎 = studentId: "1"）
  const currentStudentId = "1"

  // この講師に対して購入済みのコースパッケージを確認
  const purchasedPackage = useMemo(() => {
    return coursePackages.find(
      (pkg) => pkg.studentId === currentStudentId && pkg.instructorId === instructor.id && pkg.remainingTickets > 0
    )
  }, [instructor.id])

  const today = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return now
  }, [])

  const maxBookingDate = useMemo(() => {
    const max = new Date(today)
    max.setMonth(max.getMonth() + 2) // 2 months ahead for students
    return max
  }, [today])

  useEffect(() => {
    if (purchasedPackage) {
      // 購入済みコースがある場合、そのコースを自動選択
      const matchingCourse = instructor.coursePrices.find(
        (course) => course.name === purchasedPackage.courseName
      )
      if (matchingCourse) {
        setSelectedCourse(matchingCourse)
      }
    } else if (instructor?.coursePrices && instructor.coursePrices.length > 0) {
      setSelectedCourse(instructor.coursePrices[0])
    }
  }, [instructor, purchasedPackage])

  const getTimeSlotStatus = useCallback(
    (date: string, slot: "morning" | "afternoon" | "evening"): "available" | "tentative" | "full" => {
      const maxCapacity = instructor.timeSlotCapacity?.[slot] || 2

      const confirmedCount =
        instructor.scheduledLessons?.filter(
          (lesson) => lesson.date === date && lesson.timeSlot === slot && lesson.status === "confirmed",
        ).length || 0

      const tentativeCount =
        instructor.scheduledLessons?.filter(
          (lesson) => lesson.date === date && lesson.timeSlot === slot && lesson.status === "pending",
        ).length || 0

      const totalBooked = confirmedCount + tentativeCount

      if (confirmedCount >= maxCapacity) return "full"
      if (totalBooked >= maxCapacity) return "tentative"
      return "available"
    },
    [instructor.timeSlotCapacity, instructor.scheduledLessons],
  )

  const handleBooking = useCallback(() => {
    if (selectedLocation && selectedDate && selectedTimeSlot && selectedCourse) {
      // 未ログインの場合は会員登録ページへリダイレクト
      if (!user) {
        const returnUrl = encodeURIComponent(
          `/instructor/${instructor.id}`
        )
        router.push(`/signup/student?redirect=${returnUrl}`)
        return
      }

      const travelFee = instructor.travelAreas?.includes(selectedLocation) ? instructor.travelFee || 0 : 0
      const vehicleFee = useInstructorVehicle ? instructor.vehicleFee || 0 : 0
      const total = selectedCourse.price + travelFee + vehicleFee

      router.push(
        `/booking/complete?instructor=${instructor.id}&location=${encodeURIComponent(selectedLocation)}&date=${selectedDate}&timeSlot=${selectedTimeSlot}&course=${encodeURIComponent(selectedCourse.name)}&useVehicle=${useInstructorVehicle}&total=${total}`,
      )
    }
  }, [selectedLocation, selectedDate, selectedTimeSlot, selectedCourse, useInstructorVehicle, instructor, router, user])

  const getTwoWeeksDates = useCallback(
    (startDate: Date) => {
      const dates = []
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)

      const day = start.getDay()
      start.setDate(start.getDate() - day)

      for (let i = 0; i < 14; i++) {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        if (date <= maxBookingDate) {
          dates.push(date)
        }
      }

      return dates
    },
    [maxBookingDate],
  )

  const twoWeeksDates = useMemo(() => getTwoWeeksDates(currentWeekStart), [currentWeekStart, getTwoWeeksDates])

  const goToPreviousTwoWeeks = useCallback(() => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 14)

    // Don't go before today
    if (newDate >= today) {
      setCurrentWeekStart(newDate)
    }
  }, [currentWeekStart, today])

  const goToNextTwoWeeks = useCallback(() => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 14)

    const lastDateOfNextPeriod = new Date(newDate)
    lastDateOfNextPeriod.setDate(lastDateOfNextPeriod.getDate() + 13)

    if (newDate <= maxBookingDate) {
      setCurrentWeekStart(newDate)
    }
  }, [currentWeekStart, maxBookingDate])

  const canGoPrevious = useMemo(() => {
    const prevDate = new Date(currentWeekStart)
    prevDate.setDate(prevDate.getDate() - 14)
    return prevDate >= today
  }, [currentWeekStart, today])

  const canGoNext = useMemo(() => {
    const nextDate = new Date(currentWeekStart)
    nextDate.setDate(nextDate.getDate() + 14)
    return nextDate <= maxBookingDate
  }, [currentWeekStart, maxBookingDate])

  return (
    <>
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            asChild
            className="-ml-2 gap-2 text-foreground/80 hover:text-foreground hover:bg-primary/10"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              講師一覧に戻る
            </Link>
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="relative mx-auto sm:mx-0 h-40 w-40 shrink-0 overflow-hidden rounded-2xl ring-4 ring-primary/20">
                    <Image
                      src={instructor.avatar || "/placeholder.svg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="160px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">{instructor.name}</h1>
                        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{instructor.area}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1.5 shadow-sm shrink-0">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground">{instructor.rating}</span>
                        <span className="text-sm text-muted-foreground">({instructor.reviewCount}件)</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {instructor.badges.map((badge) => (
                        <Badge
                          key={badge}
                          className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>指導歴{instructor.experience}年</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                        <Car className="h-4 w-4 text-primary" />
                        <span>{instructor.carType}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                        <span>
                          {instructor.transmissionTypes.length === 2
                            ? "AT/MT対応"
                            : `${instructor.transmissionTypes[0]}限定`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  自己紹介
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground leading-relaxed">{instructor.introduction}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  得意分野
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center gap-1.5 rounded-full border-2 border-accent/30 bg-accent/5 px-3 py-1.5"
                    >
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">{specialty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  受講者の声
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {instructor.testimonials && instructor.testimonials.length > 0 ? (
                  <div className="space-y-4">
                    {instructor.testimonials.map((testimonial, index) => (
                      <div key={index} className="rounded-2xl border bg-card p-5 shadow-sm">
                        <div className="flex gap-4">
                          {/* Avatar */}
                          <div className="shrink-0">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src="/abstract-geometric-shapes.png" alt={testimonial.studentName} />
                              <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300">
                                <User className="h-6 w-6 text-gray-500" />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="font-semibold text-foreground">{testimonial.studentName}</span>
                              <span className="text-sm text-muted-foreground shrink-0">{testimonial.date}</span>
                            </div>
                            
                            {/* Rating and Course */}
                            <div className="flex items-center flex-wrap gap-2 mb-3">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < testimonial.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge variant="outline" className="text-xs font-normal">{testimonial.course}</Badge>
                            </div>
                            
                            {/* Comment */}
                            <p className="text-sm text-foreground leading-relaxed">{testimonial.comment}</p>
                            
                            {/* 講師からの返信 */}
                            {testimonial.reply && (
                              <div className="mt-4 bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">講師からの返信</span>
                                  {testimonial.replyDate && (
                                    <span className="text-sm text-muted-foreground">{testimonial.replyDate}</span>
                                  )}
                                </div>
                                <p className="text-sm text-foreground leading-relaxed">{testimonial.reply}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">まだレビューがありません</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 border-2 shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-br from-blue-50 to-white border-b-2 border-blue-200 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600 mb-2 tracking-wide uppercase">Re:Drive</p>
                    <h2 className="text-4xl font-bold text-gray-900">予約</h2>
                  </div>
                  <div className="text-right">
                    {purchasedPackage ? (
                      <>
                        <p className="text-xs font-medium text-green-600 mb-2">購入済みコース</p>
                        <p className="text-lg font-bold text-green-600">
                          残り {purchasedPackage.remainingTickets} 回
                        </p>
                        {(selectedLocation && instructor.travelAreas?.includes(selectedLocation)) || useInstructorVehicle ? (
                          <p className="text-sm text-gray-600 mt-1">
                            オプション: ¥{(
                              (selectedLocation && instructor.travelAreas?.includes(selectedLocation)
                                ? instructor.travelFee || 0
                                : 0) +
                              (useInstructorVehicle ? instructor.vehicleFee || 0 : 0)
                            ).toLocaleString()}
                          </p>
                        ) : null}
                      </>
                    ) : selectedCourse ? (
                      <>
                        <p className="text-xs font-medium text-gray-500 mb-2">{selectedCourse.name}</p>
                        <p className="text-3xl font-bold text-blue-600">
                          ¥
                          {(
                            selectedCourse.price +
                            (selectedLocation && instructor.travelAreas?.includes(selectedLocation)
                              ? instructor.travelFee || 0
                              : 0) +
                            (useInstructorVehicle ? instructor.vehicleFee || 0 : 0)
                          ).toLocaleString()}
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Step 1: Location Selection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                      1
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">場所を選択</h3>
                  </div>
                  <div className="space-y-2">
                    {instructor.designatedAreas && instructor.designatedAreas.length > 0 && (
                      <>
                        <p className="text-xs font-medium text-gray-600 mb-2">指定エリア（基本料金）</p>
                        <div className="grid gap-2">
                          {instructor.designatedAreas.map((area) => (
                            <button
                              key={area}
                              onClick={() => setSelectedLocation(area)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedLocation === area
                                  ? "bg-blue-50 border-blue-500"
                                  : "bg-white border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{area}</span>
                                {selectedLocation === area && <CheckCircle className="h-5 w-5 text-blue-600" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {instructor.travelAreas && instructor.travelAreas.length > 0 && (
                      <>
                        <p className="text-xs font-medium text-gray-600 mb-2 mt-4">
                          出張可能エリア（出張料金 +¥{(instructor.travelFee || 0).toLocaleString()}）
                        </p>
                        <div className="grid gap-2">
                          {instructor.travelAreas.map((area) => (
                            <button
                              key={area}
                              onClick={() => setSelectedLocation(area)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedLocation === area
                                  ? "bg-orange-50 border-orange-500"
                                  : "bg-white border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-900">{area}</span>
                                  <span className="text-xs text-orange-600 ml-2">
                                    +¥{(instructor.travelFee || 0).toLocaleString()}
                                  </span>
                                </div>
                                {selectedLocation === area && <CheckCircle className="h-5 w-5 text-orange-600" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Course Selection - 購入済みの場合はスキップ */}
                {purchasedPackage ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-green-800">コース購入済み</h3>
                    </div>
                    <p className="text-sm text-green-700">{purchasedPackage.courseName}</p>
                    <p className="text-xs text-green-600 mt-1">
                      残り {purchasedPackage.remainingTickets} 回 / {purchasedPackage.totalSessions} 回
                    </p>
                  </div>
                ) : (
                  <div className={!selectedLocation ? "opacity-50 pointer-events-none" : ""}>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                          selectedLocation ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        2
                      </div>
                      <h3 className="font-bold text-lg text-gray-900">コースを選択</h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {instructor.coursePrices.map((course) => (
                        <button
                          key={course.name}
                          onClick={() => setSelectedCourse(course)}
                          disabled={!selectedLocation}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            selectedCourse?.name === course.name
                              ? "bg-blue-50 border-blue-500"
                              : "bg-white border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="text-left">
                              <h3 className="font-bold text-base text-gray-900">{course.name}</h3>
                              <p className="text-xl font-bold text-blue-600 mt-1">¥{course.price.toLocaleString()}</p>
                            </div>
                            {selectedCourse?.name === course.name && (
                              <CheckCircle className="h-5 w-5 text-blue-600 shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={!selectedCourse ? "opacity-50 pointer-events-none" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                        selectedCourse ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {purchasedPackage ? "2" : "3"}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">オプションを選択（任意）</h3>
                  </div>
                  <div className="space-y-2">
                    {instructor.vehicleFee && (
                      <button
                        onClick={() => setUseInstructorVehicle(!useInstructorVehicle)}
                        disabled={!selectedCourse}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          useInstructorVehicle
                            ? "bg-green-50 border-green-500"
                            : "bg-white border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Car className="h-5 w-5 text-gray-600" />
                              <span className="font-medium text-gray-900">教習車レンタル</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">講師の車両を使用します</p>
                            <p className="text-lg font-bold text-green-600 mt-1">
                              +¥{instructor.vehicleFee.toLocaleString()}
                            </p>
                          </div>
                          {useInstructorVehicle && <CheckCircle className="h-5 w-5 text-green-600" />}
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className={!selectedCourse ? "opacity-50 pointer-events-none" : ""}>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                        selectedCourse ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {purchasedPackage ? "3" : "4"}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">日時を選択</h3>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-700 font-medium text-center">予約可能期間：本日から2ヶ月先まで</p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-6 shadow-inner border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToPreviousTwoWeeks}
                        disabled={!canGoPrevious}
                        className="h-10 w-10 p-0 hover:bg-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <div className="text-center">
                        {twoWeeksDates.length > 0 && (
                          <>
                            <p className="font-bold text-xl text-gray-900">
                              {twoWeeksDates[0].getFullYear()}年{twoWeeksDates[0].getMonth() + 1}月
                            </p>
                            <p className="text-sm text-gray-600">
                              {twoWeeksDates[0].getMonth() + 1}/{twoWeeksDates[0].getDate()} -{" "}
                              {twoWeeksDates[twoWeeksDates.length - 1].getMonth() + 1}/
                              {twoWeeksDates[twoWeeksDates.length - 1].getDate()}
                            </p>
                          </>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToNextTwoWeeks}
                        disabled={!canGoNext}
                        className="h-10 w-10 p-0 hover:bg-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      {twoWeeksDates.length > 0 && (
                        <>
                          {[0, 1].map((weekIndex) => {
                            const weekDates = twoWeeksDates.slice(weekIndex * 7, (weekIndex + 1) * 7)
                            if (weekDates.length === 0) return null

                            return (
                              <div key={weekIndex} className={weekIndex === 1 ? "mt-4" : ""}>
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr>
                                      <th className="p-2 text-sm font-bold text-gray-600 bg-white/50 border border-gray-200 rounded-tl-lg w-20">
                                        時間帯
                                      </th>
                                      {weekDates.map((date, index) => {
                                        const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()]
                                        return (
                                          <th
                                            key={index}
                                            className={`p-2 text-xs font-bold bg-white/50 border border-gray-200 ${
                                              index === weekDates.length - 1 ? "rounded-tr-lg" : ""
                                            } ${
                                              date.getDay() === 0
                                                ? "text-red-500"
                                                : date.getDay() === 6
                                                  ? "text-blue-500"
                                                  : "text-gray-700"
                                            }`}
                                          >
                                            <div>
                                              {dayOfWeek}
                                              {date.getDate()}
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
                                          className={`p-3 text-sm font-bold text-gray-700 bg-white/50 border border-gray-200 ${
                                            rowIndex === 2 ? "rounded-bl-lg" : ""
                                          }`}
                                        >
                                          {timeSlot.label}
                                        </td>
                                        {weekDates.map((date, colIndex) => {
                                          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                          const status = getTimeSlotStatus(dateStr, timeSlot.id as any)
                                          const isSelected =
                                            selectedDate === dateStr && selectedTimeSlot === timeSlot.id
                                          const isFull = status === "full"

                                          return (
                                            <td
                                              key={colIndex}
                                              className={`border border-gray-200 ${
                                                rowIndex === 2 && colIndex === weekDates.length - 1
                                                  ? "rounded-br-lg"
                                                  : ""
                                              }`}
                                            >
                                              <button
                                                onClick={() => {
                                                  if (!isFull) {
                                                    setSelectedDate(dateStr)
                                                    setSelectedTimeSlot(timeSlot.id as any)
                                                  }
                                                }}
                                                disabled={isFull}
                                                className={`w-full h-16 flex items-center justify-center text-2xl font-bold transition-all ${
                                                  isFull
                                                    ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                                    : isSelected
                                                      ? "bg-green-100 border-2 border-green-500 scale-105 shadow-lg"
                                                      : "bg-white hover:bg-blue-50 hover:scale-105"
                                                }`}
                                              >
                                                {status === "available" ? (
                                                  <span className="text-green-500">○</span>
                                                ) : status === "tentative" ? (
                                                  <span className="text-yellow-500">△</span>
                                                ) : (
                                                  <span className="text-gray-300">×</span>
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
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {selectedCourse && selectedLocation && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-bold text-sm text-gray-700 mb-2">料金明細</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{selectedCourse.name}</span>
                      <span className="font-medium">¥{selectedCourse.price.toLocaleString()}</span>
                    </div>
                    {instructor.travelAreas?.includes(selectedLocation) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">出張料金</span>
                        <span className="font-medium text-orange-600">
                          +¥{(instructor.travelFee || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {useInstructorVehicle && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">教習車レンタル</span>
                        <span className="font-medium text-green-600">
                          +¥{(instructor.vehicleFee || 0).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">合計</span>
                        <span className="font-bold text-blue-600 text-lg">
                          ¥
                          {(
                            selectedCourse.price +
                            (instructor.travelAreas?.includes(selectedLocation) ? instructor.travelFee || 0 : 0) +
                            (useInstructorVehicle ? instructor.vehicleFee || 0 : 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={!selectedLocation || !selectedDate || !selectedTimeSlot || !selectedCourse}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {user ? "予約リクエストを送る" : "会員登録して予約する"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
