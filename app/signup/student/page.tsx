"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import {
  Car,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function StudentSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect")
  const { register } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    // ステップ1: アカウント情報
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // ステップ2: 本人確認
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    birthdate: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address: "",
    building: "",
    // ステップ3: 免許証情報
    licenseNumber: "",
    licenseType: "",
    transmissionType: "",
    licenseIssueDate: "",
    licenseExpiryDate: "",
    licenseFrontImage: null as File | null,
    licenseBackImage: null as File | null,
    // ステップ4: 決済情報
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  const totalSteps = 4

  const updateFormData = (field: string, value: string | boolean | File | null) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      const name = `${formData.lastName} ${formData.firstName}`.trim() || formData.email.split("@")[0]
      await register({
        email: formData.email,
        password: formData.password,
        name,
        role: "student",
        phone: formData.phone || undefined,
      })
      // 登録成功 → リダイレクト先 or マイページ
      router.push(redirectUrl || "/mypage")
    } catch (err: any) {
      setError(err?.message || "登録に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "アカウント", icon: Mail },
    { number: 2, title: "本人確認", icon: User },
    { number: 3, title: "免許証", icon: Car },
    { number: 4, title: "決済情報", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <Car className="h-8 w-8" />
            Re:Drive
          </Link>
          <h1 className="text-3xl font-bold mt-4">受講生 新規登録</h1>
          <p className="text-muted-foreground mt-2">必要な情報を入力してください</p>
        </div>

        {/* プログレスインジケーター */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = currentStep > step.number
              const isCurrent = currentStep === step.number
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isCurrent
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded-full transition-all ${
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
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5 text-primary" })}
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "アカウント作成に必要な基本情報を入力してください"}
              {currentStep === 2 && "契約・保険適用のため本人確認情報が必要です"}
              {currentStep === 3 && "有効な運転免許証の情報を入力してください"}
              {currentStep === 4 && "レッスン料金の支払い方法を登録してください"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              {/* ステップ1: アカウント情報 */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
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
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1">
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
                        className="pl-10 pr-10 h-11"
                        required
                        minLength={8}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1">
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
                        className="pl-10 pr-10 h-11"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => updateFormData("agreeToTerms", checked as boolean)}
                      required
                      className="mt-1"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal leading-relaxed cursor-pointer text-muted-foreground"
                    >
                      <Link href="#" className="underline hover:text-foreground transition-colors">
                        利用規約
                      </Link>
                      と
                      <Link href="#" className="underline hover:text-foreground transition-colors">
                        プライバシーポリシー
                      </Link>
                      に同意します
                    </Label>
                  </div>
                </div>
              )}

              {/* ステップ2: 本人確認 */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {/* 氏名 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-1">
                        姓<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="山田"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-1">
                        名<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="太郎"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* フリガナ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastNameKana" className="text-sm font-medium flex items-center gap-1">
                        セイ<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastNameKana"
                        type="text"
                        placeholder="ヤマダ"
                        value={formData.lastNameKana}
                        onChange={(e) => updateFormData("lastNameKana", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstNameKana" className="text-sm font-medium flex items-center gap-1">
                        メイ<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstNameKana"
                        type="text"
                        placeholder="タロウ"
                        value={formData.firstNameKana}
                        onChange={(e) => updateFormData("firstNameKana", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* 生年月日 */}
                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="text-sm font-medium flex items-center gap-1">
                      生年月日<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => updateFormData("birthdate", e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* 電話番号 */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
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
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* 住所 */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground">住所</h3>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium flex items-center gap-1">
                        郵便番号<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="150-0001"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prefecture" className="text-sm font-medium flex items-center gap-1">
                          都道府県<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="prefecture"
                          type="text"
                          placeholder="東京都"
                          value={formData.prefecture}
                          onChange={(e) => updateFormData("prefecture", e.target.value)}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium flex items-center gap-1">
                          市区町村<span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="渋谷区"
                          value={formData.city}
                          onChange={(e) => updateFormData("city", e.target.value)}
                          className="h-11"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                        番地<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="神宮前1-1-1"
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="building" className="text-sm font-medium">
                        建物名・部屋番号
                      </Label>
                      <Input
                        id="building"
                        type="text"
                        placeholder="マンション101"
                        value={formData.building}
                        onChange={(e) => updateFormData("building", e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ3: 免許証情報 */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-sm font-medium flex items-center gap-1">
                      免許証番号<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="licenseNumber"
                      type="text"
                      placeholder="123456789012"
                      value={formData.licenseNumber}
                      onChange={(e) => updateFormData("licenseNumber", e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseType" className="text-sm font-medium flex items-center gap-1">
                        免許種別<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="licenseType"
                        type="text"
                        placeholder="普通自動車"
                        value={formData.licenseType}
                        onChange={(e) => updateFormData("licenseType", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmissionType" className="text-sm font-medium flex items-center gap-1">
                        AT/MT<span className="text-destructive">*</span>
                      </Label>
                      <select
                        id="transmissionType"
                        value={formData.transmissionType}
                        onChange={(e) => updateFormData("transmissionType", e.target.value)}
                        className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">選択してください</option>
                        <option value="AT">AT（オートマ限定）</option>
                        <option value="MT">MT（マニュアル）</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseIssueDate" className="text-sm font-medium flex items-center gap-1">
                        取得日<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="licenseIssueDate"
                        type="date"
                        value={formData.licenseIssueDate}
                        onChange={(e) => updateFormData("licenseIssueDate", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiryDate" className="text-sm font-medium flex items-center gap-1">
                        有効期限<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="licenseExpiryDate"
                        type="date"
                        value={formData.licenseExpiryDate}
                        onChange={(e) => updateFormData("licenseExpiryDate", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ステップ4: 決済情報 */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber" className="text-sm font-medium flex items-center gap-1">
                      カード番号<span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => updateFormData("cardNumber", e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName" className="text-sm font-medium flex items-center gap-1">
                      カード名義人<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="TARO YAMADA"
                      value={formData.cardName}
                      onChange={(e) => updateFormData("cardName", e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry" className="text-sm font-medium flex items-center gap-1">
                        有効期限<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={(e) => updateFormData("cardExpiry", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc" className="text-sm font-medium flex items-center gap-1">
                        CVC<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="cardCvc"
                        type="text"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={(e) => updateFormData("cardCvc", e.target.value)}
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ナビゲーションボタン */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} className="h-11 bg-transparent">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    戻る
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button type="button" variant="ghost" className="h-11">
                      戻る
                    </Button>
                  </Link>
                )}

                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext} className="h-11 shadow-lg">
                    次へ
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="h-11 shadow-lg" disabled={isSubmitting}>
                    {isSubmitting ? "登録中..." : "登録完了"}
                    {!isSubmitting && <CheckCircle2 className="h-4 w-4 ml-1" />}
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
