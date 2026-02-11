"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Check, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { specialtyOptions } from "@/lib/data"
import { useRouter } from "next/navigation"

export default function InstructorProfile() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "田中 健太",
    area: "東京都 渋谷区",
    experience: "15",
    carType: "トヨタ アクア",
    transmissionType: "AT",
    introduction:
      "15年の指導経験で、初心者から久しぶりの方まで丁寧にサポートします。緊張せずリラックスして練習できる環境を大切にしています。",
    specialties: ["高速道路", "駐車", "夜間運転"],
  })

  const [newSpecialty, setNewSpecialty] = useState("")
  const [isPhotoGuideOpen, setIsPhotoGuideOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [designatedAreas] = useState<string[]>(["大阪市北区", "大阪市中央区", "大阪市西区"])

  const MAX_SPECIALTIES = 5

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      router.push("/instructor-dashboard")
    }, 1000)
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty.trim()],
      })
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhotoUpload = () => {
    setIsPhotoGuideOpen(false)
    setPreviewImage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/instructor-dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">プロフィール編集</h1>
              <p className="text-sm text-muted-foreground">講師情報の管理</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="border-2">
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div>
              <Label>プロフィール写真</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary/20">
                  {previewImage ? (
                    <Image src={previewImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  ) : (
                    <Image
                      src="/friendly-japanese-male-driving-instructor-in-his-4.jpg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <Dialog open={isPhotoGuideOpen} onOpenChange={setIsPhotoGuideOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      写真を変更
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>プロフィール写真のガイドライン</DialogTitle>
                      <DialogDescription>受講生に安心感を与える写真を選びましょう</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {previewImage && (
                        <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 bg-secondary/10">
                          <p className="text-sm font-semibold mb-2">プレビュー</p>
                          <div className="flex justify-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden ring-2 ring-primary">
                              <Image
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          推奨
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>顔がはっきり見える正面写真</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>明るい場所で撮影</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>笑顔で親しみやすい印象</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>推奨サイズ: 400x400px以上</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          NG例
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>サングラス着用</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>複数人で写っている</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-600 mt-0.5">✗</span>
                            <span>画質が粗い</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-4 space-y-2">
                        {!previewImage ? (
                          <Label htmlFor="photo-upload" className="w-full cursor-pointer">
                            <div className="w-full border-2 border-dashed border-primary/40 rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                              <div className="flex flex-col items-center gap-2 text-sm">
                                <Upload className="h-6 w-6 text-muted-foreground" />
                                <span className="font-medium">写真を選択</span>
                                <span className="text-xs text-muted-foreground">クリックしてファイルを選択</span>
                              </div>
                            </div>
                            <Input
                              id="photo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoSelect}
                            />
                          </Label>
                        ) : (
                          <div className="space-y-2">
                            <Button className="w-full" onClick={handlePhotoUpload}>
                              <Check className="h-4 w-4 mr-2" />
                              この写真を使用する
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full bg-transparent"
                              onClick={() => setPreviewImage(null)}
                            >
                              別の写真を選択
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">氏名</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Area */}
            <div>
              <Label htmlFor="area">対応エリア</Label>
              <div className="border rounded-md p-3 bg-muted/30 text-muted-foreground">
                <p className="text-sm">
                  {designatedAreas.length > 0 ? designatedAreas.join("、") : "エリアが設定されていません"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                対応エリアは
                <Link href="/instructor-dashboard/settings" className="text-primary hover:underline">
                  登録情報の編集
                </Link>
                の指導情報タブで設定できます
              </p>
            </div>

            {/* Experience */}
            <div>
              <Label htmlFor="experience">指導経験（年）</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            {/* Car Type & Transmission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="carType">使用車両</Label>
                <Input
                  id="carType"
                  value={formData.carType}
                  onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="transmissionType">対応可能なタイプ</Label>
                <Select
                  value={formData.transmissionType}
                  onValueChange={(value) => setFormData({ ...formData, transmissionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AT">ATのみ</SelectItem>
                    <SelectItem value="MT">MTのみ</SelectItem>
                    <SelectItem value="BOTH">AT・MT両方</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  指導可能な車両タイプを選択してください
                </p>
              </div>
            </div>

            {/* Introduction */}
            <div>
              <Label htmlFor="introduction">自己紹介</Label>
              <Textarea
                id="introduction"
                rows={5}
                value={formData.introduction}
                onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              />
            </div>

            {/* Specialties */}
            <div>
              <Label>得意分野</Label>
              <p className="text-sm text-muted-foreground mb-3">
                複数選択できます（{formData.specialties.length}/{MAX_SPECIALTIES}個選択中）
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto border rounded-md p-4 bg-muted/10">
                {specialtyOptions.map((specialty) => {
                  const isMaxReached = formData.specialties.length >= MAX_SPECIALTIES
                  const isChecked = formData.specialties.includes(specialty)
                  const isDisabled = isMaxReached && !isChecked

                  return (
                    <label
                      key={specialty}
                      className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-secondary/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (formData.specialties.length < MAX_SPECIALTIES) {
                              setFormData({
                                ...formData,
                                specialties: [...formData.specialties, specialty],
                              })
                            }
                          } else {
                            setFormData({
                              ...formData,
                              specialties: formData.specialties.filter((s) => s !== specialty),
                            })
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{specialty}</span>
                    </label>
                  )
                })}
              </div>
              {formData.specialties.length >= MAX_SPECIALTIES && (
                <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  最大{MAX_SPECIALTIES}個まで選択できます
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button className="flex-1" size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "変更を保存"}
          </Button>
          <Link href="/instructor-dashboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full bg-transparent">
              キャンセル
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
