import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Clock, Car, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Instructor } from "@/lib/data"
import { memo } from "react"

interface InstructorCardProps {
  instructor: Instructor
  index?: number
}

export const InstructorCard = memo(function InstructorCard({ instructor, index = 0 }: InstructorCardProps) {
  const firstCourse = instructor.coursePrices[0]
  const priceDisplay = firstCourse.priceRange
    ? `¥${firstCourse.priceRange.min.toLocaleString()}〜`
    : `¥${firstCourse.price.toLocaleString()}`

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 bg-card">
      <CardContent className="p-0">
        {/* 画像エリア - 縦型レイアウト */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl">
          <Image
            src={instructor.avatar || "/placeholder.svg"}
            alt={instructor.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-xl"
            priority={index < 3}
            loading={index < 3 ? undefined : "lazy"}
          />
          {/* グラデーションオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* バッジ */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {instructor.badges.map((badge) => (
              <Badge key={badge} className="bg-accent text-accent-foreground text-xs font-medium shadow-md">
                {badge}
              </Badge>
            ))}
          </div>

          {/* 評価 - 画像下部に配置 */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-md">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-gray-900">{instructor.rating}</span>
            <span className="text-xs text-gray-600">({instructor.reviewCount}件)</span>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className="flex flex-col p-4">
          {/* 名前とエリア */}
          <div className="mb-2">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {instructor.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{instructor.area}</span>
            </div>
          </div>

          {/* 自己紹介 */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{instructor.introduction}</p>

          {/* 得意分野タグ */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {instructor.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                {specialty}
              </Badge>
            ))}
          </div>

          {/* 経験・車種・AT/MT情報 */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>経験{instructor.experience}年</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              <span>{instructor.carType}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-primary">
                {instructor.transmissionTypes.length === 2 ? "AT/MT" : instructor.transmissionTypes[0]}
              </span>
            </div>
          </div>

          {/* 価格とボタン */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="text-lg font-bold text-primary">{priceDisplay}</span>
              <span className="text-xs text-muted-foreground ml-1">〜</span>
            </div>
            <Button asChild size="sm" className="group/btn">
              <Link href={`/instructor/${instructor.id}`} className="flex items-center gap-1">
                詳細を見る
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
