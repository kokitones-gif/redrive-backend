"use client"

import Link from "next/link"
import { Car, Menu, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [open, setOpen] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-md">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Re:Drive</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            講師を探す
          </Link>
          <Link
            href="/guide"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            ご利用ガイド
          </Link>
          <Link href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            よくある質問
          </Link>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-muted rounded" />
          ) : user ? (
            <>
              {user.role === "instructor" ? (
                <Button variant="outline" size="sm" className="bg-transparent text-xs border-orange-300 text-orange-600 hover:bg-orange-50" asChild>
                  <Link href="/instructor-dashboard">ダッシュボード</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="bg-transparent text-xs border-blue-300 text-blue-600 hover:bg-blue-50" asChild>
                  <Link href="/mypage">マイページ</Link>
                </Button>
              )}
              <div className="w-px h-6 bg-border mx-1" />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="bg-transparent text-xs border-orange-300 text-orange-600 hover:bg-orange-50" asChild>
                <Link href="/instructor-dashboard">講師</Link>
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent text-xs border-blue-300 text-blue-600 hover:bg-blue-50" asChild>
                <Link href="/mypage">受講生</Link>
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button size="sm" className="shadow-md" asChild>
                <Link href="/signup">新規登録</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-1 mt-8 pr-4">
              <Link
                href="/"
                className="text-sm font-bold text-foreground hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                講師を探す
              </Link>
              <Link
                href="/guide"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                ご利用ガイド
              </Link>
              <Link
                href="/faq"
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors py-3 px-2 rounded-lg hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                よくある質問
              </Link>
              <div className="border-t border-border my-4" />
              {user ? (
                <>
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{user.name}</span> でログイン中
                  </div>
                  {user.role === "instructor" ? (
                    <Link href="/instructor-dashboard" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full justify-start text-sm font-bold py-3 border-orange-300 text-orange-600 bg-transparent hover:bg-orange-50">
                        ダッシュボード
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/mypage" onClick={() => setOpen(false)} className="mt-2">
                      <Button variant="outline" className="w-full justify-start text-sm font-bold py-3 border-blue-300 text-blue-600 bg-transparent hover:bg-blue-50">
                        マイページ
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm font-bold py-3 hover:bg-muted bg-transparent text-destructive mt-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground px-2 mb-2">テスト用ログイン</p>
                  <Link href="/instructor-dashboard" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full justify-start text-sm font-bold py-3 border-orange-300 text-orange-600 bg-transparent hover:bg-orange-50">
                      講師としてログイン
                    </Button>
                  </Link>
                  <Link href="/mypage" onClick={() => setOpen(false)} className="mt-2">
                    <Button variant="outline" className="w-full justify-start text-sm font-bold py-3 border-blue-300 text-blue-600 bg-transparent hover:bg-blue-50">
                      受講生としてログイン
                    </Button>
                  </Link>
                  <div className="border-t border-border my-4" />
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-sm font-bold py-3 hover:bg-muted bg-transparent">
                      ログイン
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="mt-2">
                    <Button className="w-[90%] mx-auto flex text-sm font-bold py-3 shadow-md">新規登録</Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
