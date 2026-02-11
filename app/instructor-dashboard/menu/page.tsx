"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Settings } from "lucide-react"

export default function MenuSettingsPage() {
  const router = useRouter()
  const [menuData, setMenuData] = useState({
    courses: [
      { name: "1回コース", duration: "100", sessions: 1, price: "9000" },
      { name: "4回コース", duration: "100", sessions: 4, price: "34000" },
      { name: "10回コース", duration: "100", sessions: 10, price: "80000" },
    ],
  })

  const handleMenuChange = (index: number, field: string, value: string | number) => {
    const updatedCourses = [...menuData.courses]
    updatedCourses[index] = { ...updatedCourses[index], [field]: value }
    setMenuData({ courses: updatedCourses })
  }

  const handleAddCourse = () => {
    setMenuData({
      courses: [...menuData.courses, { name: "", duration: "100", sessions: 1, price: "" }],
    })
  }

  const handleRemoveCourse = (index: number) => {
    setMenuData({
      courses: menuData.courses.filter((_, i) => i !== index),
    })
  }

  const handleSaveMenu = () => {
    alert("メニュー設定を保存しました")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">メニュー設定</h1>
              <p className="text-sm text-muted-foreground">コース内容と料金の管理</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">オプション料金設定</h3>
                <p className="text-sm text-muted-foreground">
                  出張料金や教習車レンタル費用などの追加料金を設定できます
                </p>
              </div>
              <Button onClick={() => router.push("/instructor-dashboard/pricing")} className="gap-2">
                <Settings className="h-4 w-4" />
                オプション料金を設定
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {menuData.courses.map((course, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3 bg-background">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">コース {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCourse(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      削除
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>コース名</Label>
                      <Input
                        value={course.name}
                        onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                        placeholder="例: 初心者向け4回コース"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>1回あたりの時間（分）</Label>
                      <select
                        value={course.duration}
                        onChange={(e) => handleMenuChange(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      >
                        <option value="30">30分</option>
                        <option value="60">60分</option>
                        <option value="90">90分</option>
                        <option value="100">100分</option>
                        <option value="120">120分</option>
                        <option value="150">150分</option>
                        <option value="180">180分</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>回数</Label>
                      <Input
                        type="number"
                        min="1"
                        value={course.sessions}
                        onChange={(e) => handleMenuChange(index, "sessions", Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>料金（円）</Label>
                      <Input
                        type="number"
                        min="0"
                        value={course.price}
                        onChange={(e) => handleMenuChange(index, "price", e.target.value)}
                      />
                      {course.sessions > 1 && course.price && (
                        <p className="text-sm text-muted-foreground">
                          1回あたり: ¥{Math.round(Number(course.price) / course.sessions).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddCourse} className="w-full bg-transparent">
                + コースを追加
              </Button>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveMenu}>保存</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
