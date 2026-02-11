"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, CheckCircle } from "lucide-react"

function CarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* 車体の影 */}
      <ellipse cx="32" cy="38" rx="26" ry="3" fill="rgba(0,0,0,0.15)" />
      {/* 車体下部 */}
      <path 
        d="M6 24 L58 24 L58 32 Q58 36 54 36 L10 36 Q6 36 6 32 Z" 
        fill="#22c55e" 
      />
      {/* 車体下部のハイライト */}
      <path 
        d="M8 24 L56 24 L56 26 L8 26 Z" 
        fill="#4ade80" 
      />
      {/* 車体上部（キャビン） */}
      <path 
        d="M14 24 L18 12 Q20 8 26 8 L38 8 Q44 8 46 12 L50 24 Z" 
        fill="#16a34a" 
      />
      {/* フロントガラス */}
      <path 
        d="M19 22 L22 13 Q23 11 27 11 L32 11 L32 22 Z" 
        fill="#7dd3fc" 
      />
      {/* フロントガラスの反射 */}
      <path 
        d="M21 20 L23 14 Q24 13 26 13 L28 13 L28 20 Z" 
        fill="#bae6fd" 
        opacity="0.6"
      />
      {/* リアガラス */}
      <path 
        d="M45 22 L42 13 Q41 11 37 11 L32 11 L32 22 Z" 
        fill="#7dd3fc" 
      />
      {/* タイヤ（後輪） */}
      <circle cx="16" cy="34" r="7" fill="#1f2937" />
      <circle cx="16" cy="34" r="5" fill="#374151" />
      <circle cx="16" cy="34" r="2" fill="#9ca3af" />
      {/* タイヤ（前輪） */}
      <circle cx="48" cy="34" r="7" fill="#1f2937" />
      <circle cx="48" cy="34" r="5" fill="#374151" />
      <circle cx="48" cy="34" r="2" fill="#9ca3af" />
      {/* ヘッドライト */}
      <rect x="54" y="26" width="4" height="3" rx="1" fill="#fef08a" />
      {/* テールライト */}
      <rect x="6" y="26" width="3" height="3" rx="1" fill="#ef4444" />
      {/* ドアライン */}
      <line x1="32" y1="24" x2="32" y2="34" stroke="#15803d" strokeWidth="1" />
      {/* ドアハンドル */}
      <rect x="24" y="28" width="4" height="1.5" rx="0.5" fill="#15803d" />
      <rect x="36" y="28" width="4" height="1.5" rx="0.5" fill="#15803d" />
    </svg>
  )
}

interface RecommendationResult {
  sessions: number
  reason: string
}

function getRecommendedSessions(yearsWithoutDriving: number): RecommendationResult {
  if (yearsWithoutDriving < 5) {
    return {
      sessions: 4,
      reason: "5年未満のブランクには基礎の確認と実践練習で十分です",
    }
  } else if (yearsWithoutDriving < 10) {
    return {
      sessions: 7,
      reason: "5年以上のブランクには段階的な練習で自信を取り戻しましょう",
    }
  } else if (yearsWithoutDriving < 20) {
    return {
      sessions: 10,
      reason: "10年以上のブランクにはじっくり時間をかけて練習します",
    }
  } else {
    return {
      sessions: 20,
      reason: "20年以上のブランクには基礎から徹底的にサポートします",
    }
  }
}

export function CourseRecommendation() {
  const [years, setYears] = useState<number>(5)
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null)

  useEffect(() => {
    const result = getRecommendedSessions(years)
    setRecommendation(result)
  }, [years])

  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20">
            <Lightbulb className="h-4 w-4 text-accent" />
          </div>
          おすすめ受講回数診断
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">運転していない期間</span>
            <span className="text-2xl font-bold text-foreground">
              {years}<span className="text-base font-normal text-muted-foreground ml-1">年</span>
            </span>
          </div>
          <div className="relative pt-2 pb-4">
            <div className="h-2 bg-muted rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-150"
                style={{ width: `${(years / 30) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer z-10"
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
              style={{ left: `calc(${(years / 30) * 100}% - 28px)` }}
            >
              <CarIcon className="h-14 w-14 drop-shadow-lg" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0年</span>
            <span>10年</span>
            <span>20年</span>
            <span>30年</span>
          </div>
        </div>

        {recommendation && (
          <div className="rounded-lg bg-accent/10 p-4 border border-accent/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-accent shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-foreground text-xl">
                  おすすめ受講回数: <span className="text-accent">{recommendation.sessions}回</span>
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{recommendation.reason}</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          ※ 講師によって設定しているコースが異なります。詳細は各講師のページでご確認ください。
        </p>
      </CardContent>
    </Card>
  )
}
