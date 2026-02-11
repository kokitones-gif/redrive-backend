"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { areas, specialtyOptions, instructorTypeOptions, ageGroupOptions } from "@/lib/data"

interface SearchFiltersProps {
  selectedArea: string
  setSelectedArea: (area: string) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  selectedSpecialties: string[]
  setSelectedSpecialties: (specialties: string[]) => void
  selectedInstructorTypes: string[]
  setSelectedInstructorTypes: (types: string[]) => void
  selectedAgeGroups: string[]
  setSelectedAgeGroups: (ages: string[]) => void
  selectedPriceRange: string
  setSelectedPriceRange: (range: string) => void
}

const priceRangeOptions = ["すべて", "¥5,000以下", "¥5,000 - ¥7,000", "¥7,000 - ¥10,000", "¥10,000以上"]

export function SearchFilters({
  selectedArea,
  setSelectedArea,
  selectedDate,
  setSelectedDate,
  selectedSpecialties,
  setSelectedSpecialties,
  selectedInstructorTypes,
  setSelectedInstructorTypes,
  selectedAgeGroups,
  setSelectedAgeGroups,
  selectedPriceRange,
  setSelectedPriceRange,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== specialty))
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty])
    }
  }

  const toggleInstructorType = (type: string) => {
    if (selectedInstructorTypes.includes(type)) {
      setSelectedInstructorTypes(selectedInstructorTypes.filter((t) => t !== type))
    } else {
      setSelectedInstructorTypes([...selectedInstructorTypes, type])
    }
  }

  const toggleAgeGroup = (age: string) => {
    if (selectedAgeGroups.includes(age)) {
      setSelectedAgeGroups(selectedAgeGroups.filter((a) => a !== age))
    } else {
      setSelectedAgeGroups([...selectedAgeGroups, age])
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="pl-10 bg-background">
                <SelectValue placeholder="エリアを選択" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 bg-background"
              placeholder="日付を選択"
            />
          </div>
          <Button className="gap-2">
            <Search className="h-4 w-4" />
            検索
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-foreground">指導員タイプで絞り込み</p>
            <div className="flex flex-wrap gap-2">
              {instructorTypeOptions.map((type) => (
                <Badge
                  key={type}
                  variant={selectedInstructorTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => toggleInstructorType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-foreground">年齢層で絞り込み</p>
            <div className="flex flex-wrap gap-2">
              {ageGroupOptions.map((age) => (
                <Badge
                  key={age}
                  variant={selectedAgeGroups.includes(age) ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => toggleAgeGroup(age)}
                >
                  {age}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-foreground">得意分野で絞り込み</p>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((specialty) => (
                <Badge
                  key={specialty}
                  variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="mb-3 text-sm font-medium text-foreground">価格帯で絞り込み</p>
            <div className="flex flex-wrap gap-2">
              {priceRangeOptions.map((range) => (
                <Badge
                  key={range}
                  variant={selectedPriceRange === range ? "default" : "outline"}
                  className="cursor-pointer transition-colors hover:bg-primary/10"
                  onClick={() => setSelectedPriceRange(range)}
                >
                  {range}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
