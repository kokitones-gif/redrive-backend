"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, CreditCard, Award as IdCard, Save, Upload, X, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading, isAuthenticated, logout, refreshSession } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    // 基本情報
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    birthdate: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",

    // 免許証情報
    licenseNumber: "",
    licenseType: "普通自動車第一種",
    transmissionType: "AT",
    licenseIssueDate: "",
    licenseExpiryDate: "",
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/mypage/settings")
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            const p = data.profile
            const u = data.user
            if (p) {
              setFormData({
                lastName: p.last_name || "",
                firstName: p.first_name || "",
                lastNameKana: p.last_name_kana || "",
                firstNameKana: p.first_name_kana || "",
                birthdate: p.birthdate || "",
                email: u?.email || "",
                phone: p.phone || "",
                postalCode: p.postal_code || "",
                prefecture: p.prefecture || "",
                city: p.city || "",
                address: p.address || "",
                building: p.building || "",
                licenseNumber: p.license_number || "",
                licenseType: p.license_type || "普通自動車第一種",
                transmissionType: p.transmission_type || "AT",
                licenseIssueDate: p.license_issue_date || "",
                licenseExpiryDate: p.license_expiry_date || "",
              })
            } else if (u) {
              const nameParts = (u.name || "").split(" ")
              setFormData((prev) => ({
                ...prev,
                lastName: nameParts[0] || "",
                firstName: nameParts.slice(1).join(" ") || "",
                email: u.email || "",
              }))
            }
          }
        })
        .catch(console.error)
        .finally(() => setDataLoading(false))
    }
  }, [isAuthenticated])

  const [licenseFrontImage, setLicenseFrontImage] = useState<File | null>(null)
  const [licenseBackImage, setLicenseBackImage] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (type: "front" | "back", file: File | null) => {
    if (type === "front") {
      setLicenseFrontImage(file)
    } else {
      setLicenseBackImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const res = await fetch("/api/mypage/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (res.ok) {
        setSaveMessage({ type: "success", text: "設定を保存しました" })
        await refreshSession()
      } else {
        setSaveMessage({ type: "error", text: data.error || "保存に失敗しました" })
      }
    } catch {
      setSaveMessage({ type: "error", text: "ネットワークエラーが発生しました" })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 4000)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (authLoading || (isAuthenticated && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-primary/5">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!authUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <Link href="/mypage">
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                マイページに戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              基本情報設定
            </h1>
            <p className="text-muted-foreground">アカウント情報を編集・管理</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">
                  <User className="h-4 w-4 mr-2" />
                  基本情報
                </TabsTrigger>
                <TabsTrigger value="license">
                  <IdCard className="h-4 w-4 mr-2" />
                  免許証情報
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  決済情報
                </TabsTrigger>
              </TabsList>

              {/* 基本情報タブ */}
              <TabsContent value="basic">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                    <CardDescription>氏名、連絡先、住所などの基本情報を編集できます</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 氏名 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName">姓 *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">名 *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* フリガナ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastNameKana">セイ *</Label>
                        <Input
                          id="lastNameKana"
                          value={formData.lastNameKana}
                          onChange={(e) => handleInputChange("lastNameKana", e.target.value)}
                          placeholder="ヤマダ"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="firstNameKana">メイ *</Label>
                        <Input
                          id="firstNameKana"
                          value={formData.firstNameKana}
                          onChange={(e) => handleInputChange("firstNameKana", e.target.value)}
                          placeholder="タロウ"
                          required
                        />
                      </div>
                    </div>

                    {/* 生年月日 */}
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">生年月日 *</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => handleInputChange("birthdate", e.target.value)}
                        required
                      />
                    </div>

                    {/* 連絡先 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">電話番号 *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="090-1234-5678"
                          required
                        />
                      </div>
                    </div>

                    {/* 住所 */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">郵便番号 *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          placeholder="150-0001"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prefecture">都道府県 *</Label>
                          <Select
                            value={formData.prefecture}
                            onValueChange={(value) => handleInputChange("prefecture", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="東京都">東京都</SelectItem>
                              <SelectItem value="神奈川県">神奈川県</SelectItem>
                              <SelectItem value="埼玉県">埼玉県</SelectItem>
                              <SelectItem value="千葉県">千葉県</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">市区町村 *</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">番地 *</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="building">建物名・部屋番号</Label>
                        <Input
                          id="building"
                          value={formData.building}
                          onChange={(e) => handleInputChange("building", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 免許証情報タブ */}
              <TabsContent value="license">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>免許証情報</CardTitle>
                    <CardDescription>運転免許証の情報を編集できます</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 免許証番号 */}
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">免許証番号 *</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        placeholder="12桁の番号"
                        maxLength={12}
                        required
                      />
                    </div>

                    {/* 免許種別 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseType">免許種別 *</Label>
                        <Select
                          value={formData.licenseType}
                          onValueChange={(value) => handleInputChange("licenseType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="普通自動車第一種">普通自動車第一種</SelectItem>
                            <SelectItem value="普通自動車第二種">普通自動車第二種</SelectItem>
                            <SelectItem value="準中型自動車">準中型自動車</SelectItem>
                            <SelectItem value="中型自動車">中型自動車</SelectItem>
                            <SelectItem value="大型自動車">大型自動車</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="transmissionType">AT/MT *</Label>
                        <Select
                          value={formData.transmissionType}
                          onValueChange={(value) => handleInputChange("transmissionType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AT">AT（オートマ限定）</SelectItem>
                            <SelectItem value="MT">MT（マニュアル）</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          AT限定免許の方は「AT」を選択してください
                        </p>
                      </div>
                    </div>

                    {/* 取得年月日・有効期限 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="licenseIssueDate">取得年月日 *</Label>
                        <Input
                          id="licenseIssueDate"
                          type="date"
                          value={formData.licenseIssueDate}
                          onChange={(e) => handleInputChange("licenseIssueDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseExpiryDate">有効期限 *</Label>
                        <Input
                          id="licenseExpiryDate"
                          type="date"
                          value={formData.licenseExpiryDate}
                          onChange={(e) => handleInputChange("licenseExpiryDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* 免許証画像 */}
                    <div className="space-y-4">
                      <Label>免許証画像</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 表面 */}
                        <div className="space-y-2">
                          <Label htmlFor="licenseFront" className="text-sm text-muted-foreground">
                            表面 *
                          </Label>
                          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                            <input
                              id="licenseFront"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload("front", e.target.files?.[0] || null)}
                            />
                            <label htmlFor="licenseFront" className="cursor-pointer">
                              {licenseFrontImage ? (
                                <div className="space-y-2">
                                  <div className="text-sm font-medium text-primary">{licenseFrontImage.name}</div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleImageUpload("front", null)
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    削除
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                  <div className="text-sm text-muted-foreground">クリックしてアップロード</div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* 裏面 */}
                        <div className="space-y-2">
                          <Label htmlFor="licenseBack" className="text-sm text-muted-foreground">
                            裏面 *
                          </Label>
                          <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                            <input
                              id="licenseBack"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload("back", e.target.files?.[0] || null)}
                            />
                            <label htmlFor="licenseBack" className="cursor-pointer">
                              {licenseBackImage ? (
                                <div className="space-y-2">
                                  <div className="text-sm font-medium text-primary">{licenseBackImage.name}</div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleImageUpload("back", null)
                                    }}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    削除
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                  <div className="text-sm text-muted-foreground">クリックしてアップロード</div>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 決済情報タブ */}
              <TabsContent value="payment">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>決済情報</CardTitle>
                    <CardDescription>クレジットカード情報を管理できます</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center shrink-0">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">VISA •••• 1234</div>
                          <div className="text-sm text-muted-foreground">有効期限: 12/2027</div>
                        </div>
                        <Button variant="outline" size="sm">
                          変更
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      新しいカードを追加
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* 保存ボタン */}
            {saveMessage && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                  saveMessage.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {saveMessage.text}
              </div>
            )}
            <div className="flex justify-end gap-4 mt-6">
              <Link href="/mypage">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "保存中..." : "変更を保存"}
              </Button>
            </div>
          </form>

          {/* ログアウトボタン */}
          <Card className="shadow-lg border-muted mt-6">
            <CardHeader>
              <CardTitle className="text-lg">ログアウト</CardTitle>
              <CardDescription>アカウントからログアウトします</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                ログアウト
              </Button>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
