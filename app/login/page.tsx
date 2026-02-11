"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Car, Mail, Lock, Eye, EyeOff, GraduationCap, User, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [userType, setUserType] = useState<"student" | "instructor" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password, userType || "student")

      if (redirectUrl) {
        router.push(redirectUrl)
      } else if (userType === "instructor") {
        router.push("/instructor-dashboard")
      } else {
        router.push("/mypage")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ログインに失敗しました"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">Re:Drive</span>
          </Link>

          <Card className="shadow-2xl border-2">
            <CardHeader className="space-y-1 text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ログイン
              </CardTitle>
              <CardDescription className="text-base">ログインするアカウントタイプを選択してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all bg-transparent"
                onClick={() => setUserType("student")}
              >
                <User className="h-8 w-8 text-primary" />
                <div className="text-center">
                  <div className="font-bold text-base text-black">受講生としてログイン</div>
                  <div className="text-xs text-muted-foreground">講習を予約して受講する</div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-24 flex flex-col gap-2 hover:bg-accent/5 hover:border-accent transition-all bg-transparent"
                onClick={() => setUserType("instructor")}
              >
                <GraduationCap className="h-8 w-8 text-accent" />
                <div className="text-center">
                  <div className="font-bold text-base text-foreground">講師としてログイン</div>
                  <div className="text-xs text-muted-foreground">講習を提供して収益を得る</div>
                </div>
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  アカウントをお持ちでない方は
                  <Link
                    href="/signup"
                    className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    新規登録
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <Car className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Re:Drive</span>
        </Link>

        <Card className="shadow-2xl border-2">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {userType === "instructor" ? "講師ログイン" : "受講生ログイン"}
            </CardTitle>
            <CardDescription className="text-base">
              {userType === "instructor"
                ? "講師アカウントにログインしてスケジュール管理"
                : "アカウントにログインして講習を予約しましょう"}
            </CardDescription>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setUserType(null)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← アカウントタイプを変更
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    ログイン状態を保持
                  </Label>
                </div>
                <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  パスワードを忘れた
                </Link>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />ログイン中...</> : "ログイン"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">または</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full h-11 bg-transparent">
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Googleでログイン
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでない方は
                <Link
                  href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/signup"}
                  className="ml-1 font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  新規登録
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ログインすることで
          <Link href="#" className="underline hover:text-foreground transition-colors">
            利用規約
          </Link>
          と
          <Link href="#" className="underline hover:text-foreground transition-colors">
            プライバシーポリシー
          </Link>
          に同意したものとみなされます。
        </p>
      </div>
    </div>
  )
}
