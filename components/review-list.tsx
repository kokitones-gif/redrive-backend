import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  comment: string
}

const reviews: Review[] = [
  {
    id: "1",
    author: "S.T.",
    rating: 5,
    date: "2025年1月5日",
    comment:
      "10年ぶりの運転で緊張していましたが、とても穏やかに教えていただき、リラックスして練習できました。駐車のコツも分かりやすく、自信がつきました！",
  },
  {
    id: "2",
    author: "M.K.",
    rating: 5,
    date: "2025年1月3日",
    comment: "子供の送り迎えのために練習したくて予約しました。実際のルートで練習させてもらえて、本当に助かりました。",
  },
  {
    id: "3",
    author: "Y.N.",
    rating: 4,
    date: "2024年12月28日",
    comment: "高速道路の合流が苦手でしたが、丁寧に教えてもらって克服できました。また利用したいです。",
  },
]

export function ReviewList() {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border-2 border-primary/10 bg-gradient-to-r from-secondary/50 to-transparent p-4 hover:border-primary/20 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-primary-foreground shadow-md">
                {review.author.charAt(0)}
              </div>
              <span className="font-medium text-foreground">{review.author}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted",
                  )}
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          <p className="mt-2 text-xs text-muted-foreground/70">{review.date}</p>
        </div>
      ))}
    </div>
  )
}
