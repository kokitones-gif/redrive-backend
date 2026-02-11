"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Search,
  Calendar,
  MessageCircle,
  CreditCard,
  Shield,
  Clock,
  MapPin,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function GuidePage() {
  const steps = [
    {
      icon: Search,
      title: "講師を探す",
      description: "エリア、日付、得意分野から講師を検索",
      details: ["トップページで希望のエリアを選択", "日程や教習内容で絞り込み", "講師のプロフィールと口コミを確認"],
    },
    {
      icon: Calendar,
      title: "日時を選択",
      description: "講師の空き状況から予約日時を選択",
      details: [
        "カレンダーから希望日を選択",
        "空いている時間帯を確認",
        "ペーパードライバー歴に応じたおすすめコースを診断",
      ],
    },
    {
      icon: MessageCircle,
      title: "予約リクエスト",
      description: "講師にメッセージを送信して予約",
      details: ["希望内容や不安なことをメッセージで伝える", "待ち合わせ場所を相談", "講師からの返信を待つ"],
    },
    {
      icon: CheckCircle,
      title: "予約確定",
      description: "講師が承認したら予約完了",
      details: ["予約確定メールが届く", "マイページで詳細を確認", "当日の待ち合わせ場所を確認"],
    },
    {
      icon: CreditCard,
      title: "レッスン受講",
      description: "当日、講師と合流してレッスン開始",
      details: ["指定の場所・時間に集合", "免許証を持参", "レッスン後に支払い"],
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "安心の本人確認",
      description: "全講師は運転免許証による本人確認済み",
    },
    {
      icon: Clock,
      title: "柔軟なスケジュール",
      description: "講師の空き状況から都合の良い時間を選択",
    },
    {
      icon: MapPin,
      title: "希望の場所で",
      description: "自宅周辺や練習したい場所を指定可能",
    },
    {
      icon: User,
      title: "相性で選べる",
      description: "講師の人となりやレビューから自分に合う人を選択",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">ご利用ガイド</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Re:Driveの使い方を分かりやすくご説明します</p>
        </div>

        {/* 利用の流れ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">利用の流れ</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* サービスの特徴 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">サービスの特徴</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 mb-4">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/20 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">さっそく講師を探してみましょう</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                あなたにぴったりの講師を見つけて、運転の不安を解消しましょう
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/">講師を探す</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/faq">よくある質問</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
