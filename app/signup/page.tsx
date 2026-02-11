"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Car, GraduationCap, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Car className="h-8 w-8" />
            Re:Drive
          </Link>
          <h1 className="text-3xl font-bold mt-4">新規登録</h1>
          <p className="text-muted-foreground mt-2">アカウントタイプを選択してください</p>
        </div>

        {/* アカウントタイプ選択カード */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 受講生サインアップ */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">受講生として登録</CardTitle>
              <CardDescription className="text-base mt-2">ペーパードライバー講習を受けたい方</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>経験豊富な講師を検索・予約</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>自分のペースで運転を学べる</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>柔軟なスケジュール調整</span>
                </li>
              </ul>
              <Button className="w-full h-12 text-base shadow-lg" onClick={() => router.push("/signup/student")}>
                受講生として登録する
              </Button>
            </CardContent>
          </Card>

          {/* 講師サインアップ */}
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Car className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="text-2xl">講師として登録</CardTitle>
              <CardDescription className="text-base mt-2">ペーパードライバー講習を提供したい方</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>自分のスケジュールで働ける</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>安定した収入を得られる</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <span>運転指導の経験を活かせる</span>
                </li>
              </ul>
              <Button
                className="w-full h-12 text-base shadow-lg"
                variant="secondary"
                onClick={() => router.push("/signup/instructor")}
              >
                講師として登録する
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ログインリンク */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            すでにアカウントをお持ちの方は
            <Link href="/login" className="text-primary hover:underline ml-1 font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
