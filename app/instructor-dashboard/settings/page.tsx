"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, User, FileText, Car, DollarSign, Shield, Upload } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function InstructorSettings() {
  const [formData, setFormData] = useState({
    // 基本情報
    lastName: "田中",
    firstName: "健太",
    lastNameKana: "タナカ",
    firstNameKana: "ケンタ",
    birthdate: "1985-03-15",
    phone: "090-1234-5678",
    email: "tanaka@example.com",
    // 免許証情報
    licenseNumber: "123456789012",
    licenseType: "普通自動車第一種",
    licenseInitialDate: "2003-04-01",
    licenseExpiryDate: "2026-03-15",
    // 車両情報
    vehicleMake: "トヨタ",
    vehicleModel: "プリウス",
    vehicleYear: "2020",
    vehiclePlate: "品川 500 あ 1234",
    hasAuxiliaryBrake: true,
    // 指導情報
    serviceAreas: "東京都（品川区、目黒区、渋谷区）",
    designatedAreas: [] as string[],
    travelAreas: [] as string[],
    availableDays: [] as string[],
    teachingContent: "高速道路、縦列駐車、車庫入れ",
    // 自己PR
    selfIntroduction: "指導歴10年のベテラン講師です。初心者の方も安心してお任せください。",
    teachingPhilosophy: "生徒さんのペースに合わせた丁寧な指導を心がけています。",
    drivingExperience: "25年",
    teachingExperience: "10年",
    // 報酬受取情報
    bankName: "三井住友銀行",
    branchName: "渋谷支店",
    accountType: "普通",
    accountNumber: "1234567",
    accountHolder: "タナカ ケンタ",
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBooleanChange = (field: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("保存しました")
  }

  const areaOptions = {
    大阪府: [
      "大阪市北区",
      "大阪市中央区",
      "大阪市西区",
      "大阪市天王寺区",
      "大阪市浪速区",
      "大阪市東成区",
      "大阪市生野区",
      "大阪市阿倍野区",
      "大阪市住吉区",
      "大阪市東住吉区",
      "大阪市西成区",
      "大阪市淀川区",
      "大阪市東淀川区",
      "大阪市旭区",
      "大阪市城東区",
      "大阪市鶴見区",
      "大阪市住之江区",
      "大阪市平野区",
      "大阪市西淀川区",
      "大阪市此花区",
      "大阪市港区",
      "大阪市大正区",
      "大阪市福島区",
      "堺市",
      "岸和田市",
      "豊中市",
      "吹田市",
      "高槻市",
      "枚方市",
      "茨木市",
      "八尾市",
      "寝屋川市",
      "東大阪市",
    ],
    兵庫県: [
      "神戸市東灘区",
      "神戸市灘区",
      "神戸市兵庫区",
      "神戸市長田区",
      "神戸市須磨区",
      "神戸市垂水区",
      "神戸市北区",
      "神戸市中央区",
      "神戸市西区",
      "姫路市",
      "尼崎市",
      "明石市",
      "西宮市",
      "芦屋市",
      "伊丹市",
      "宝塚市",
      "川西市",
    ],
    京都府: [
      "京都市北区",
      "京都市上京区",
      "京都市左京区",
      "京都市中京区",
      "京都市東山区",
      "京都市下京区",
      "京都市南区",
      "京都市右京区",
      "京都市伏見区",
      "京都市山科区",
      "京都市西京区",
      "宇治市",
      "亀岡市",
      "長岡京市",
      "八幡市",
    ],
    奈良県: ["奈良市", "大和郡山市", "天理市", "橿原市", "桜井市", "生駒市"],
    滋賀県: ["大津市", "彦根市", "長浜市", "近江八幡市", "草津市", "守山市", "栗東市"],
    和歌山県: ["和歌山市", "海南市", "橋本市", "有田市", "御坊市", "田辺市"],
  }

  const dayOptions = ["月", "火", "水", "木", "金", "土", "日"]

  const handleAreaToggle = (area: string, type: "designated" | "travel") => {
    const field = type === "designated" ? "designatedAreas" : "travelAreas"
    const currentAreas = formData[field]
    if (currentAreas.includes(area)) {
      setFormData({ ...formData, [field]: currentAreas.filter((a) => a !== area) })
    } else {
      setFormData({ ...formData, [field]: [...currentAreas, area] })
    }
  }

  const handleDayToggle = (day: string) => {
    const currentDays = formData.availableDays
    if (currentDays.includes(day)) {
      handleChange(
        "availableDays",
        currentDays.filter((d) => d !== day),
      )
    } else {
      handleChange("availableDays", [...currentDays, day])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/instructor-dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold">登録情報の編集</h1>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-auto mb-8">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              基本情報
            </TabsTrigger>
            <TabsTrigger
              value="license"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              免許証
            </TabsTrigger>
            <TabsTrigger
              value="vehicle"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              車両情報
            </TabsTrigger>
            <TabsTrigger
              value="teaching"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              指導情報
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              報酬受取
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>基本情報</CardTitle>
                    <CardDescription>氏名、生年月日、連絡先などの基本情報</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastNameKana">セイ</Label>
                    <Input
                      id="lastNameKana"
                      value={formData.lastNameKana}
                      onChange={(e) => handleChange("lastNameKana", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstNameKana">メイ</Label>
                    <Input
                      id="firstNameKana"
                      value={formData.firstNameKana}
                      onChange={(e) => handleChange("firstNameKana", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">生年月日</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => handleChange("birthdate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="license">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>免許証情報</CardTitle>
                    <CardDescription>運転免許証の詳細情報</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">免許証番号</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange("licenseNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseType">免許種別</Label>
                    <Input
                      id="licenseType"
                      value={formData.licenseType}
                      onChange={(e) => handleChange("licenseType", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseInitialDate">取得年月日</Label>
                    <Input
                      id="licenseInitialDate"
                      type="date"
                      value={formData.licenseInitialDate}
                      onChange={(e) => handleChange("licenseInitialDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">有効期限</Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => handleChange("licenseExpiryDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>免許証画像</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">表面をアップロード</p>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">裏面をアップロード</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>車両情報</CardTitle>
                    <CardDescription>教習に使用する車両の情報</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">メーカー</Label>
                    <Input
                      id="vehicleMake"
                      value={formData.vehicleMake}
                      onChange={(e) => handleChange("vehicleMake", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">車種</Label>
                    <Input
                      id="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={(e) => handleChange("vehicleModel", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleYear">年式</Label>
                    <Input
                      id="vehicleYear"
                      value={formData.vehicleYear}
                      onChange={(e) => handleChange("vehicleYear", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehiclePlate">ナンバー</Label>
                    <Input
                      id="vehiclePlate"
                      value={formData.vehiclePlate}
                      onChange={(e) => handleChange("vehiclePlate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasAuxiliaryBrake"
                    checked={formData.hasAuxiliaryBrake}
                    onChange={(e) => handleBooleanChange("hasAuxiliaryBrake", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="hasAuxiliaryBrake">補助ブレーキあり</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teaching">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>指導情報</CardTitle>
                    <CardDescription>対応エリアや指導内容など</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">指定エリア（複数選択可）</Label>
                    <p className="text-sm text-muted-foreground mt-1">通常料金で対応可能なエリアを選択してください</p>
                  </div>
                  <div className="border rounded-lg p-4 max-h-80 overflow-y-auto space-y-4 bg-muted/30">
                    {Object.entries(areaOptions).map(([prefecture, districts]) => (
                      <div key={prefecture} className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary sticky top-0 bg-muted/30 py-1">
                          {prefecture}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-2">
                          {districts.map((district) => (
                            <label
                              key={district}
                              htmlFor={`designated-${district}`}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-background/50 p-2 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                id={`designated-${district}`}
                                checked={formData.designatedAreas.includes(district)}
                                onChange={() => handleAreaToggle(district, "designated")}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{district}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.designatedAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-muted-foreground">選択中:</span>
                      {formData.designatedAreas.map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">出張エリア（複数選択可）</Label>
                    <p className="text-sm text-muted-foreground mt-1">出張料金が適用されるエリアを選択してください</p>
                  </div>
                  <div className="border rounded-lg p-4 max-h-80 overflow-y-auto space-y-4 bg-muted/30">
                    {Object.entries(areaOptions).map(([prefecture, districts]) => (
                      <div key={prefecture} className="space-y-3">
                        <h4 className="font-semibold text-sm text-primary sticky top-0 bg-muted/30 py-1">
                          {prefecture}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-2">
                          {districts.map((district) => (
                            <label
                              key={district}
                              htmlFor={`travel-${district}`}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-background/50 p-2 rounded transition-colors"
                            >
                              <input
                                type="checkbox"
                                id={`travel-${district}`}
                                checked={formData.travelAreas.includes(district)}
                                onChange={() => handleAreaToggle(district, "travel")}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">{district}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formData.travelAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-muted-foreground">選択中:</span>
                      {formData.travelAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="bg-orange-100 text-orange-800">
                          {area} +出張料金
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teachingContent">得意な指導内容</Label>
                    <Input
                      id="teachingContent"
                      value={formData.teachingContent}
                      onChange={(e) => handleChange("teachingContent", e.target.value)}
                      placeholder="高速道路、縦列駐車、車庫入れ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="selfIntroduction">自己紹介</Label>
                    <Textarea
                      id="selfIntroduction"
                      value={formData.selfIntroduction}
                      onChange={(e) => handleChange("selfIntroduction", e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teachingPhilosophy">指導方針</Label>
                    <Textarea
                      id="teachingPhilosophy"
                      value={formData.teachingPhilosophy}
                      onChange={(e) => handleChange("teachingPhilosophy", e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>報酬受取情報</CardTitle>
                    <CardDescription>振込先口座の情報</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">銀行名</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">支店名</Label>
                    <Input
                      id="branchName"
                      value={formData.branchName}
                      onChange={(e) => handleChange("branchName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">口座種別</Label>
                    <Input
                      id="accountType"
                      value={formData.accountType}
                      onChange={(e) => handleChange("accountType", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">口座番号</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => handleChange("accountNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accountHolder">口座名義</Label>
                    <Input
                      id="accountHolder"
                      value={formData.accountHolder}
                      onChange={(e) => handleChange("accountHolder", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
