"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { SearchFilters } from "@/components/search-filters"
import { InstructorCard } from "@/components/instructor-card"
import { CourseRecommendation } from "@/components/course-recommendation"
import { instructors } from "@/lib/data"
import { Users, Shield, Clock, Sparkles } from "lucide-react"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState("すべてのエリア")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedInstructorTypes, setSelectedInstructorTypes] = useState<string[]>([])
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState("すべて")

  const filteredInstructors = useMemo(() => {
    return instructors.filter((instructor) => {
      if (selectedArea !== "すべてのエリア" && instructor.area !== selectedArea) {
        return false
      }
      if (selectedDate && !instructor.availableDates.includes(selectedDate)) {
        return false
      }
      if (selectedSpecialties.length > 0 && !selectedSpecialties.some((s) => instructor.specialties.includes(s))) {
        return false
      }
      if (selectedInstructorTypes.length > 0) {
        const matchesType = selectedInstructorTypes.every((type) => {
          if (type === "ベテラン" && instructor.experience >= 15) return true
          if (type === "女性" && instructor.gender === "female") return true
          if (type === "優しい" && instructor.teachingStyle.includes("優しい")) return true
          if (type === "厳しめ" && instructor.teachingStyle.includes("厳しめ")) return true
          if (type === "指導員資格者" && instructor.hasInstructorLicense) return true
          if (type === "人気講師" && instructor.badges.includes("人気講師")) return true
          if (type === "高評価" && instructor.rating >= 4.8) return true
          return false
        })
        if (!matchesType) return false
      }
      if (selectedAgeGroups.length > 0 && !selectedAgeGroups.includes(instructor.ageGroup)) {
        return false
      }
      if (selectedPriceRange !== "すべて") {
        const price = instructor.pricePerHour
        if (selectedPriceRange === "¥5,000以下" && price > 5000) return false
        if (selectedPriceRange === "¥5,000 - ¥7,000" && (price < 5000 || price > 7000)) return false
        if (selectedPriceRange === "¥7,000 - ¥10,000" && (price < 7000 || price > 10000)) return false
        if (selectedPriceRange === "¥10,000以上" && price < 10000) return false
      }
      return true
    })
  }, [selectedArea, selectedDate, selectedSpecialties, selectedInstructorTypes, selectedAgeGroups, selectedPriceRange])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-16 md:py-24">
        {/* 装飾的な背景要素 */}
        <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              あなたの運転デビューをサポート
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
              あなたにぴったりの講師と
              <br />
              <span className="text-primary">安心の運転再開</span>を
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              経験豊富な講師を選んで、自分のペースで練習できます。
              <br className="hidden sm:inline" />
              まずは講師のプロフィールをチェックしてみましょう。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-lg border border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100</p>
                <p className="text-sm text-muted-foreground">認定講師</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-lg border border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/70 shadow-md">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground">満足度</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-lg border border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3 to-chart-3/70 shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24時間</p>
                <p className="text-sm text-muted-foreground">予約受付</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Recommendation section after hero */}
      <section className="py-12 bg-gradient-to-br from-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-3">何回受講すればいい？</h2>
              <p className="text-muted-foreground">あなたにおすすめの受講回数をご提案します。</p>
            </div>
            <CourseRecommendation />
          </div>
        </div>
      </section>

      {/* Search & Results */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <SearchFilters
            selectedArea={selectedArea}
            setSelectedArea={setSelectedArea}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSpecialties={selectedSpecialties}
            setSelectedSpecialties={setSelectedSpecialties}
            selectedInstructorTypes={selectedInstructorTypes}
            setSelectedInstructorTypes={setSelectedInstructorTypes}
            selectedAgeGroups={selectedAgeGroups}
            setSelectedAgeGroups={setSelectedAgeGroups}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
          />

          <div className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                講師一覧
                <span className="ml-2 text-base font-normal text-muted-foreground">
                  ({filteredInstructors.length}名)
                </span>
              </h2>
            </div>

            {filteredInstructors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInstructors.map((instructor, index) => (
                  <InstructorCard key={instructor.id} instructor={instructor} index={index} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">
                  条件に合う講師が見つかりませんでした。
                  <br />
                  検索条件を変更してお試しください。
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
