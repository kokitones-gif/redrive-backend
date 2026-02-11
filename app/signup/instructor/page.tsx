"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Car,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  DollarSign,
  Award,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { specialtyOptions } from "@/lib/data"

export default function InstructorSignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    // ステップ1: アカウント情報
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // ステップ2: 基本情報
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    birthdate: "",
    gender: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",
    phone: "",
    profilePhoto: null as File | null,
    // ステップ3: 免許証情報
    licenseNumber: "",
    licenseType: "",
    licenseInitialDate: "",
    licenseExpiryDate: "",
    violationHistory: "",
    licenseFrontImage: null as File | null,
    licenseBackImage: null as File | null,
    // ステップ4: 本人確認書類
    idDocumentType: "",
    idDocumentImage: null as File | null,
    idDocumentImageBack: null as File | null,
    // ステップ5: 車両情報
    hasOwnVehicle: false,
    vehicleRegistration: null as File | null,
    insuranceDocument: null as File | null,
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vehiclePlate: "",
    vehiclePhoto: null as File | null,
    hasAuxiliaryBrake: false,
    // ステップ6: 指導情報
    teachingContent: [] as string[],
    vehicleOptions: [] as string[],
    languages: [] as string[],
    transmissionType: "",
    designatedAreas: [] as string[],
    travelAreas: [] as string[],
    specialties: [] as string[],
    // ステップ7: 自己PR
    selfIntroduction: "",
    teachingPhilosophy: "",
    drivingExperience: "",
    teachingExperience: "",
    // ステップ8: 報酬受取情報
    bankName: "",
    branchName: "",
    accountType: "",
    accountNumber: "",
    accountHolder: "",
    // オプション資格
    hasInstructorLicense: false,
    hasSafetyTraining: false,
    hasGoldLicense: false,
    hasInsuranceLicense: false,
    certificateImages: [] as File[],
  })

  const totalSteps = 8

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    updateFormData(field, file)
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Instructor signup data:", formData)
    router.push("/instructor-dashboard")
  }

  const steps = [
    { number: 1, title: "アカウント", icon: Mail },
    { number: 2, title: "基本情報", icon: User },
    { number: 3, title: "免許証", icon: Car },
    { number: 4, title: "本人確認", icon: FileText },
    { number: 5, title: "車両", icon: Car },
    { number: 6, title: "指導情報", icon: Briefcase },
    { number: 7, title: "自己PR", icon: FileText },
    { number: 8, title: "報酬受取", icon: DollarSign },
  ]

  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ]

  const areaOptions: Record<string, string[]> = {
    大阪府: [
      "大阪市北区", "大阪市中央区", "大阪市西区", "大阪市天王寺区", "大阪市浪速区",
      "大阪市東成区", "大阪市生野区", "大阪市阿倍野区", "大阪市住吉区", "大阪市東住吉区",
      "大阪市西成区", "大阪市淀川区", "大阪市東淀川区", "大阪市旭区", "大阪市城東区",
      "大阪市鶴見区", "大阪市住之江区", "大阪市平野区", "大阪市西淀川区", "大阪市此花区",
      "大阪市港区", "大阪市大正区", "大阪市福島区", "堺市", "岸和田市", "豊中市", "吹田市",
      "高槻市", "枚方市", "茨木市", "八尾市", "寝屋川市", "東大阪市",
    ],
    兵庫県: [
      "神戸市東灘区", "神戸市灘区", "神戸市兵庫区", "神戸市長田区", "神戸市須磨区",
      "神戸市垂水区", "神戸市北区", "神戸市中央区", "神戸市西区", "姫路市", "尼崎市",
      "明石市", "西宮市", "芦屋市", "伊丹市", "宝塚市", "川西市",
    ],
    京都府: [
      "京都市北区", "京都市上京区", "京都市左京区", "京都市中京区", "京都市東山区",
      "京都市下京区", "京都市南区", "京都市右京区", "京都市伏見区", "京都市山科区",
      "京都市西京区", "宇治市", "亀岡市", "長岡京市", "八幡市",
    ],
    奈良県: ["奈良市", "大和郡山市", "天理市", "橿原市", "桜井市", "生駒市"],
    滋賀県: ["大津市", "彦根市", "長浜市", "近江八幡市", "草津市", "守山市", "栗東市"],
    和歌山県: ["和歌山市", "海南市", "橋本市", "有田市", "御坊市", "田辺市"],
    東京都: [
      "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区",
      "品川区", "目黒区", "大田区", "世田谷区", "渋谷区", "中野区", "杉並区", "豊島区",
      "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区",
    ],
    神奈川県: [
      "横浜市鶴見区", "横浜市神奈川区", "横浜市西区", "横浜市中区", "横浜市南区",
      "横浜市港南区", "横浜市保土ケ谷区", "横浜市旭区", "横浜市磯子区", "横浜市金沢区",
      "横浜市港北区", "横浜市緑区", "横浜市青葉区", "横浜市都筑区", "横浜市戸塚区",
      "横浜市栄区", "横浜市泉区", "横浜市瀬谷区", "川崎市", "相模原市", "藤沢市", "茅ヶ崎市",
    ],
    埼玉県: [
      "さいたま市", "川越市", "熊谷市", "川口市", "所沢市", "春日部市", "草加市",
      "越谷市", "蕨市", "戸田市", "朝霞市", "志木市", "和光市", "新座市",
    ],
    千葉県: [
      "千葉市", "市川市", "船橋市", "松戸市", "野田市", "柏市", "流山市", "浦安市",
      "習志野市", "八千代市", "我孫子市", "鎌ケ谷市", "市原市", "木更津市",
    ],
  }

  const handleAreaToggle = (area: string, type: "designated" | "travel") => {
    const field = type === "designated" ? "designatedAreas" : "travelAreas"
    const currentAreas = formData[field]
    if (currentAreas.includes(area)) {
      updateFormData(field, currentAreas.filter((a: string) => a !== area))
    } else {
      updateFormData(field, [...currentAreas, area])
    }
  }

  const MAX_SPECIALTIES = 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Car className="h-8 w-8" />
            Re:Drive
          </Link>
          <h1 className="text-3xl font-bold mt-4">講師 新規登録</h1>
          <p className="text-muted-foreground mt-2">講師として活動するための情報を入力してください</p>
        </div>

        {/* プログレスインジケーター */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max px-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.number
              const isCurrent = currentStep === step.number
              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-xs font-bold">{step.number}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1.5 font-medium whitespace-nowrap ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-12 mx-2 rounded-full transition-all ${
                        isCompleted ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* フォームカード */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {steps[currentStep - 1] && (
                <>
                  {(() => {
                    const Icon = steps[currentStep - 1].icon
                    return <Icon className="h-5 w-5 text-primary" />
                  })()}
                  {steps[currentStep - 1].title}
                </>
              )}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "アカウント作成に必要な基本情報を入力してください"}
              {currentStep === 2 && "氏名・住所・連絡先を入力してください"}
              {currentStep === 3 && "運転免許証の情報を入力してください"}
              {currentStep === 4 && "本人確認書類をアップロードしてください"}
              {currentStep === 5 && "使用する車両の情報を入力してください"}
              {currentStep === 6 && "指導可能なエリア・時間帯・内容を入力してください"}
              {currentStep === 7 && "自己紹介と指導方針を入力してください"}
              {currentStep === 8 && "報酬を受け取る口座情報を入力してください"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* ステップ1: アカウント情報 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      メールアドレス<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      パスワード<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="8文字以上"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      パスワード（確認）<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="パスワードを再入力"
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                      required
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      <Link href="#" className="underline">
                        利用規約
                      </Link>
                      と
                      <Link href="#" className="underline">
                        プライバシーポリシー
                      </Link>
                      に同意します
                    </Label>
                  </div>
                </div>
              )}

              {/* ステップ2: 基本情報 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        姓<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="山田"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        名<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="太郎"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastNameKana">
                        セイ<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastNameKana"
                        placeholder="ヤマダ"
                        value={formData.lastNameKana}
                        onChange={(e) => updateFormData("lastNameKana", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstNameKana">
                        メイ<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstNameKana"
                        placeholder="タロウ"
                        value={formData.firstNameKana}
                        onChange={(e) => updateFormData("firstNameKana", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate">
                      生年月日<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => updateFormData("birthdate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">性別（任意）</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男性</SelectItem>
                        <SelectItem value="female">女性</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                        <SelectItem value="none">回答しない</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      電話番号<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="090-1234-5678"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="postalCode">
                        郵便番号<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        placeholder="123-4567"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="prefecture">
                        都道府県<span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.prefecture}
                        onValueChange={(value) => updateFormData("prefecture", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {prefectures.map((pref) => (
                            <SelectItem key={pref} value={pref}>
                              {pref}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">
                      市区町村<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="渋谷区"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      番地<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      placeholder="渋谷1-2-3"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="building">建物名・部屋番号</Label>
                    <Input
                      id="building"
                      placeholder="渋谷マンション101"
                      value={formData.building}
                      onChange={(e) => updateFormData("building", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">
                      プロフィール写真<span className="text-destructive">*</span>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("profilePhoto", e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">顔がはっきり写った写真をアップロードしてください</p>
                  </div>
                </div>
              )}

              {/* ステップ3: 免許証情報 */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">
                      免許証番号<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="licenseNumber"
                      placeholder="123456789012"
                      value={formData.licenseNumber}
                      onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseType">
                      免許の種類<span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.licenseType}
                      onValueChange={(value) => updateFormData("licenseType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="普通">普通</SelectItem>
                        <SelectItem value="普通二種">普通二種</SelectItem>
                        <SelectItem value="中型">中型</SelectItem>
                        <SelectItem value="大型">大型</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseInitialDate">
                      初回取得年月日<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="licenseInitialDate"
                      type="date"
                      value={formData.licenseInitialDate}
                      onChange={(e) => updateFormData("licenseInitialDate", e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">運転歴3年以上の確認のため</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">
                      有効期限<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="licenseExpiryDate"
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => updateFormData("licenseExpiryDate", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>指導可能なタイプ<span className="text-destructive">*</span></Label>
                    <Select
                      value={formData.transmissionType}
                      onValueChange={(value) => updateFormData("transmissionType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AT">ATのみ</SelectItem>
                        <SelectItem value="MT">MTのみ</SelectItem>
                        <SelectItem value="BOTH">AT・MT両方</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">AT限定免許の場合は「ATのみ」を選択してください</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="violationHistory">
                      違反歴の自己申告<span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="violationHistory"
                      placeholder="過去3年以内の重大違反がある場合は記載してください。なければ「なし」と入力。"
                      value={formData.violationHistory}
                      onChange={(e) => updateFormData("violationHistory", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      運転免許証（表）<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("licenseFrontImage", e.target.files?.[0] || null)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      運転免許証（裏）<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("licenseBackImage", e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* ステップ4: 本人確認書類 */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idDocumentType">
                      本人確認書類の種類<span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.idDocumentType}
                      onValueChange={(value) => updateFormData("idDocumentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mynumber">マイナンバーカード</SelectItem>
                        <SelectItem value="passport">パスポート</SelectItem>
                        <SelectItem value="resident">住民票（3ヶ月以内）</SelectItem>
                        <SelectItem value="insurance">健康保険証 + 補助書類</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      本人確認書類（表面）<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange("idDocumentImage", e.target.files?.[0] || null)}
                      required
                    />
                  </div>

                  {formData.idDocumentType && ["mynumber", "insurance"].includes(formData.idDocumentType) && (
                    <div className="space-y-2">
                      <Label>本人確認書類（裏面）</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("idDocumentImageBack", e.target.files?.[0] || null)}
                      />
                    </div>
                  )}

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      本人確認書類について
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• マイナンバーカード：表裏両面</li>
                      <li>• パスポート：顔写真ページ</li>
                      <li>• 住民票：発行日から3ヶ月以内</li>
                      <li>• 健康保険証：表裏 + 公共料金領収書など補助書類</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ステップ5: 車両情報 */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasOwnVehicle"
                      checked={formData.hasOwnVehicle}
                      onCheckedChange={(checked) => updateFormData("hasOwnVehicle", checked)}
                    />
                    <Label htmlFor="hasOwnVehicle" className="cursor-pointer">
                      自分の車を使用する
                    </Label>
                  </div>

                  {formData.hasOwnVehicle && (
                    <>
                      <div className="space-y-2">
                        <Label>
                          車検証<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange("vehicleRegistration", e.target.files?.[0] || null)}
                          required={formData.hasOwnVehicle}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          自動車保険証券<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange("insuranceDocument", e.target.files?.[0] || null)}
                          required={formData.hasOwnVehicle}
                        />
                        <p className="text-xs text-muted-foreground">対人・対物の補償内容が確認できるもの</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>メーカー</Label>
                          <Input
                            placeholder="トヨタ"
                            value={formData.vehicleMake}
                            onChange={(e) => updateFormData("vehicleMake", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>車種</Label>
                          <Input
                            placeholder="プリウス"
                            value={formData.vehicleModel}
                            onChange={(e) => updateFormData("vehicleModel", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>年式</Label>
                          <Input
                            placeholder="2020"
                            value={formData.vehicleYear}
                            onChange={(e) => updateFormData("vehicleYear", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ナンバープレート</Label>
                          <Input
                            placeholder="品川123あ4567"
                            value={formData.vehiclePlate}
                            onChange={(e) => updateFormData("vehiclePlate", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>車両写真（外観）</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange("vehiclePhoto", e.target.files?.[0] || null)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasAuxiliaryBrake"
                          checked={formData.hasAuxiliaryBrake}
                          onCheckedChange={(checked) => updateFormData("hasAuxiliaryBrake", checked)}
                        />
                        <Label htmlFor="hasAuxiliaryBrake" className="cursor-pointer">
                          補助ブレーキあり（優遇表示）
                        </Label>
                      </div>
                    </>
                  )}

                  {!formData.hasOwnVehicle && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        受講者の車両やレンタカーでの指導も可能です。車両情報の入力は不要です。
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ステップ6: 指導情報 */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  {/* 指定エリア */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base">指定エリア（複数選択可）<span className="text-destructive">*</span></Label>
                      <p className="text-sm text-muted-foreground mt-1">通常料金で対応可能なエリアを選択してください</p>
                    </div>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-4 bg-muted/30">
                      {Object.entries(areaOptions).map(([prefecture, districts]) => (
                        <div key={prefecture} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary sticky top-0 bg-muted/30 py-1">{prefecture}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
                            {districts.map((district) => (
                              <label
                                key={district}
                                htmlFor={`designated-${district}`}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-background/50 p-1 rounded text-sm"
                              >
                                <input
                                  type="checkbox"
                                  id={`designated-${district}`}
                                  checked={formData.designatedAreas.includes(district)}
                                  onChange={() => handleAreaToggle(district, "designated")}
                                  className="rounded border-gray-300"
                                />
                                <span>{district}</span>
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
                          <Badge key={area} variant="secondary">{area}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 出張エリア */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base">出張エリア（複数選択可）</Label>
                      <p className="text-sm text-muted-foreground mt-1">出張料金が適用されるエリアを選択してください</p>
                    </div>
                    <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-4 bg-muted/30">
                      {Object.entries(areaOptions).map(([prefecture, districts]) => (
                        <div key={prefecture} className="space-y-2">
                          <h4 className="font-semibold text-sm text-primary sticky top-0 bg-muted/30 py-1">{prefecture}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pl-2">
                            {districts.map((district) => (
                              <label
                                key={district}
                                htmlFor={`travel-${district}`}
                                className="flex items-center space-x-2 cursor-pointer hover:bg-background/50 p-1 rounded text-sm"
                              >
                                <input
                                  type="checkbox"
                                  id={`travel-${district}`}
                                  checked={formData.travelAreas.includes(district)}
                                  onChange={() => handleAreaToggle(district, "travel")}
                                  className="rounded border-gray-300"
                                />
                                <span>{district}</span>
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
                          <Badge key={area} variant="secondary" className="bg-orange-100 text-orange-800">{area} +出張料金</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 得意分野 */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base">得意分野<span className="text-destructive">*</span></Label>
                      <p className="text-sm text-muted-foreground">複数選択できます（{formData.specialties.length}/{MAX_SPECIALTIES}個選択中）</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-md p-4 bg-muted/10">
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
                                    updateFormData("specialties", [...formData.specialties, specialty])
                                  }
                                } else {
                                  updateFormData("specialties", formData.specialties.filter((s) => s !== specialty))
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
                      <p className="text-sm text-orange-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        最大{MAX_SPECIALTIES}個まで選択できます
                      </p>
                    )}
                    {formData.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 指導可能内容 */}
                  <div className="space-y-2">
                    <Label>指導可能内容<span className="text-destructive">*</span></Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["基本操作", "駐車", "高速道路", "夜間運転", "雨天走行", "狭路走行"].map((content) => (
                        <div key={content} className="flex items-center space-x-2">
                          <Checkbox
                            id={`content-${content}`}
                            checked={formData.teachingContent.includes(content)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("teachingContent", [...formData.teachingContent, content])
                              } else {
                                updateFormData(
                                  "teachingContent",
                                  formData.teachingContent.filter((c) => c !== content),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`content-${content}`} className="cursor-pointer text-sm">
                            {content}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 対応車両オプション */}
                  <div className="space-y-2">
                    <Label>対応車両オプション<span className="text-destructive">*</span></Label>
                    <div className="space-y-2">
                      {["講師の車", "受講者の車", "レンタカー"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`vehicle-${option}`}
                            checked={formData.vehicleOptions.includes(option)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("vehicleOptions", [...formData.vehicleOptions, option])
                              } else {
                                updateFormData(
                                  "vehicleOptions",
                                  formData.vehicleOptions.filter((v) => v !== option),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`vehicle-${option}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 対応言語 */}
                  <div className="space-y-2">
                    <Label>対応言語</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["日本語", "英語", "中国語", "韓国語", "ベトナム語", "その他"].map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={formData.languages.includes(lang)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData("languages", [...formData.languages, lang])
                              } else {
                                updateFormData(
                                  "languages",
                                  formData.languages.filter((l) => l !== lang),
                                )
                              }
                            }}
                          />
                          <Label htmlFor={`lang-${lang}`} className="cursor-pointer text-sm">
                            {lang}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ7: 自己PR */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="selfIntroduction">
                      自己紹介文<span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="selfIntroduction"
                      placeholder="あなたの人となりや指導への思いを自由に書いてください（200〜500文字）"
                      value={formData.selfIntroduction}
                      onChange={(e) => updateFormData("selfIntroduction", e.target.value)}
                      rows={5}
                      required
                      minLength={200}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">{formData.selfIntroduction.length} / 500文字</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingPhilosophy">
                      指導方針・得意分野<span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="teachingPhilosophy"
                      placeholder="例：「女性目線で丁寧に」「高速道路が得意」など"
                      value={formData.teachingPhilosophy}
                      onChange={(e) => updateFormData("teachingPhilosophy", e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drivingExperience">
                      運転歴<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="drivingExperience"
                      placeholder="例：運転歴15年、無事故"
                      value={formData.drivingExperience}
                      onChange={(e) => updateFormData("drivingExperience", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingExperience">指導経験</Label>
                    <Input
                      id="teachingExperience"
                      placeholder="例：指導歴5年、累計100名以上"
                      value={formData.teachingExperience}
                      onChange={(e) => updateFormData("teachingExperience", e.target.value)}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      任意資格（差別化・信頼向上）
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasInstructorLicense"
                          checked={formData.hasInstructorLicense}
                          onCheckedChange={(checked) => updateFormData("hasInstructorLicense", checked)}
                        />
                        <Label htmlFor="hasInstructorLicense" className="cursor-pointer text-sm">
                          教習指導員資格（「有資格者」バッジ表示）
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasSafetyTraining"
                          checked={formData.hasSafetyTraining}
                          onCheckedChange={(checked) => updateFormData("hasSafetyTraining", checked)}
                        />
                        <Label htmlFor="hasSafetyTraining" className="cursor-pointer text-sm">
                          安全運転講習修了証
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasGoldLicense"
                          checked={formData.hasGoldLicense}
                          onCheckedChange={(checked) => updateFormData("hasGoldLicense", checked)}
                        />
                        <Label htmlFor="hasGoldLicense" className="cursor-pointer text-sm">
                          ゴールド免許（「ゴールド講師」表示）
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="hasInsuranceLicense"
                          checked={formData.hasInsuranceLicense}
                          onCheckedChange={(checked) => updateFormData("hasInsuranceLicense", checked)}
                        />
                        <Label htmlFor="hasInsuranceLicense" className="cursor-pointer text-sm">
                          損害保険募集人資格
                        </Label>
                      </div>
                    </div>

                    {(formData.hasInstructorLicense ||
                      formData.hasSafetyTraining ||
                      formData.hasGoldLicense ||
                      formData.hasInsuranceLicense) && (
                      <div className="space-y-2 pt-2">
                        <Label>資格証明書</Label>
                        <Input type="file" accept="image/*" multiple />
                        <p className="text-xs text-muted-foreground">選択した資格の証明書をアップロードしてください</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ステップ8: 報酬受取情報 */}
              {currentStep === 8 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">
                      銀行名<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bankName"
                      placeholder="三菱UFJ銀行"
                      value={formData.bankName}
                      onChange={(e) => updateFormData("bankName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchName">
                      支店名<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="branchName"
                      placeholder="渋谷支店"
                      value={formData.branchName}
                      onChange={(e) => updateFormData("branchName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">
                      口座種別<span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.accountType}
                      onValueChange={(value) => updateFormData("accountType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="普通">普通</SelectItem>
                        <SelectItem value="当座">当座</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">
                      口座番号<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="accountNumber"
                      placeholder="1234567"
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData("accountNumber", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">
                      口座名義（カタカナ）<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="accountHolder"
                      placeholder="ヤマダタロウ"
                      value={formData.accountHolder}
                      onChange={(e) => updateFormData("accountHolder", e.target.value)}
                      required
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">報酬の振込について</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• 月末締め、翌月15日払い</li>
                      <li>• プラットフォーム手数料20%</li>
                      <li>• 振込手数料は当社負担</li>
                      <li>• 最低振込金額：3,000円</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ナビゲーションボタン */}
              <div className="flex justify-between mt-6 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="bg-transparent">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    戻る
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button type="button" variant="ghost">
                      戻る
                    </Button>
                  </Link>
                )}

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext} className="shadow-lg">
                    次へ
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="shadow-lg">
                    登録完了
                    <CheckCircle2 className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 進捗表示 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            ステップ {currentStep} / {totalSteps}
          </p>
        </div>
      </div>
    </div>
  )
}
