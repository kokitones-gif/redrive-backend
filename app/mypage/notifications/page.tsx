"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Mail, MessageSquare, Calendar, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    messageAlerts: true,
    promotions: false,
    instructorUpdates: true,
    paymentReceipts: true,
    reviewRequests: true,
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSave = () => {
    // 実際のアプリではAPIに送信
    alert("通知設定を保存しました")
  }

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
          <div className="mb-6 flex items-center gap-4">
            <Link href="/mypage">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                通知設定
              </h1>
              <p className="text-muted-foreground">受け取る通知をカスタマイズ</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 通知方法 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  通知方法
                </CardTitle>
                <CardDescription>通知を受け取る方法を選択してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <Label htmlFor="email-notifications" className="cursor-pointer">
                        メール通知
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">登録メールアドレスに通知を送信します</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle("emailNotifications")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Label htmlFor="push-notifications" className="cursor-pointer">
                        プッシュ通知
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">ブラウザやアプリに通知を表示します</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={() => handleToggle("pushNotifications")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 通知の種類 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>通知の種類</CardTitle>
                <CardDescription>受け取りたい通知を選択してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <Label htmlFor="booking-reminders" className="cursor-pointer">
                        予約リマインダー
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">レッスンの24時間前に通知します</p>
                  </div>
                  <Switch
                    id="booking-reminders"
                    checked={settings.bookingReminders}
                    onCheckedChange={() => handleToggle("bookingReminders")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <Label htmlFor="message-alerts" className="cursor-pointer">
                        メッセージ通知
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">講師からメッセージが届いたら通知します</p>
                  </div>
                  <Switch
                    id="message-alerts"
                    checked={settings.messageAlerts}
                    onCheckedChange={() => handleToggle("messageAlerts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <Label htmlFor="instructor-updates" className="cursor-pointer">
                        講師情報の更新
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">お気に入り講師の空き状況や新情報を通知します</p>
                  </div>
                  <Switch
                    id="instructor-updates"
                    checked={settings.instructorUpdates}
                    onCheckedChange={() => handleToggle("instructorUpdates")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <Label htmlFor="payment-receipts" className="cursor-pointer">
                        支払い領収書
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">決済完了時に領収書をメールで送信します</p>
                  </div>
                  <Switch
                    id="payment-receipts"
                    checked={settings.paymentReceipts}
                    onCheckedChange={() => handleToggle("paymentReceipts")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <Label htmlFor="review-requests" className="cursor-pointer">
                        レビューリクエスト
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">レッスン後にレビュー投稿のお願いを送信します</p>
                  </div>
                  <Switch
                    id="review-requests"
                    checked={settings.reviewRequests}
                    onCheckedChange={() => handleToggle("reviewRequests")}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <Label htmlFor="promotions" className="cursor-pointer">
                        プロモーション情報
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground">キャンペーンやお得な情報をお届けします</p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={settings.promotions}
                    onCheckedChange={() => handleToggle("promotions")}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 保存ボタン */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                設定を保存
              </Button>
              <Link href="/mypage" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  キャンセル
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
