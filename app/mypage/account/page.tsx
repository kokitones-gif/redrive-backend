"use client"

import type React from "react"
import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, Trash2, AlertTriangle, Eye, EyeOff, Check, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AccountPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string>("/placeholder-user.jpg")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageChanged, setImageChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      alert("ファイルサイズは5MB以下にしてください")
      return
    }

    // ファイル形式チェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください")
      return
    }

    setIsUploadingImage(true)

    // プレビュー用にローカルURLを生成
    const reader = new FileReader()
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string
      setProfileImage(imageUrl)
      
      // 実際のアップロード処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsUploadingImage(false)
      setImageChanged(true)
      setTimeout(() => setImageChanged(false), 3000)
    }
    reader.readAsDataURL(file)
  }



  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("新しいパスワードが一致しません")
      return
    }

    if (passwordData.newPassword.length < 8) {
      alert("パスワードは8文字以上で入力してください")
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setPasswordChanged(true)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    
    setTimeout(() => setPasswordChanged(false), 3000)
  }

  const handleDeleteAccount = () => {
    alert("アカウント削除リクエストを受け付けました。確認メールをお送りします。")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/mypage">
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                マイページに戻る
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              アカウント管理
            </h1>
            <p className="text-muted-foreground">パスワード変更とアカウント削除</p>
          </div>

          <div className="space-y-6">
            {/* プロフィール画像 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  プロフィール画像
                </CardTitle>
                <CardDescription>プロフィールに表示される画像を変更できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-primary/20">
                      {profileImage ? (
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="プロフィール画像" className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-muted">
                          <User className="h-16 w-16 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      type="button"
                      onClick={handleImageClick}
                      disabled={isUploadingImage}
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImageClick}
                      disabled={isUploadingImage}
                      className="bg-transparent"
                    >
                      {isUploadingImage ? "アップロード中..." : "画像を変更"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPEG、PNG形式、5MB以下の画像をアップロードできます。新しい画像をアップロードすると、既存の画像は自動的に置き換わります。
                    </p>
                    {imageChanged && (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">プロフィール画像を更新しました</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* パスワード変更 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  パスワード変更
                </CardTitle>
                <CardDescription>定期的なパスワード変更をおすすめします</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">現在のパスワード</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新しいパスワード</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">8文字以上で入力してください</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {passwordChanged && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                      <Check className="h-4 w-4" />
                      <span className="text-sm">パスワードを変更しました</span>
                    </div>
                  )}

                  <Button type="submit" disabled={isSaving} className="w-full">
                    {isSaving ? "変更中..." : "パスワードを変更"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* アカウント削除 */}
            <Card className="shadow-lg border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  アカウント削除
                </CardTitle>
                <CardDescription>アカウントを完全に削除します。この操作は取り消せません。</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm text-destructive">
                      <p className="font-medium mb-1">アカウントを削除すると以下のデータが失われます：</p>
                      <ul className="list-disc list-inside space-y-1 text-destructive/80">
                        <li>予約履歴</li>
                        <li>メッセージ履歴</li>
                        <li>レビュー</li>
                        <li>登録情報</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      アカウントを削除する
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>本当にアカウントを削除しますか？</AlertDialogTitle>
                      <AlertDialogDescription>
                        この操作は取り消すことができません。すべてのデータが完全に削除されます。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        削除する
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
