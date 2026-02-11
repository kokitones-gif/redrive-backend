"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search, MessageCircle, CreditCard, Calendar, Shield, Car } from "lucide-react"
import Link from "next/link"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = [
    {
      name: "予約について",
      icon: Calendar,
      questions: [
        {
          q: "予約はどのように行いますか？",
          a: "講師プロフィールから空き状況を確認し、希望の日時を選択して予約リクエストを送信します。講師が承認すると予約が確定します。",
        },
        {
          q: "予約のキャンセルはできますか？",
          a: "コース（複数回）を購入された場合、予約から1週間以内であればキャンセル可能です。ただし、初回予約が確定した時点でキャンセルはできません。講師と受講生間でトラブルが発生した場合は、特例として返金対応を検討いたします。",
        },
        {
          q: "何日前から予約できますか？",
          a: "講師が設定した空き状況に応じて、最大2ヶ月先まで予約可能です。",
        },
        {
          q: "複数回のレッスンをまとめて予約できますか？",
          a: "コースプラン（4回・7回・10回）を選択することで、計画的にレッスンを受講できます。個別の日程は講師と相談して決定します。",
        },
      ],
    },
    {
      name: "料金・支払いについて",
      icon: CreditCard,
      questions: [
        {
          q: "料金はいつ支払いますか？",
          a: "レッスン完了後、登録済みのクレジットカードから自動的に決済されます。",
        },
        {
          q: "どんな支払い方法がありますか？",
          a: "クレジットカード（Visa、Mastercard、JCB、American Express）でのお支払いが可能です。",
        },
        {
          q: "領収書は発行されますか？",
          a: "マイページの予約履歴から領収書をダウンロードできます。",
        },
        {
          q: "講習の途中でやめたい場合、返金されますか？",
          a: "原則として初回予約確定後の返金は致しかねます。ただし、講師と受講生間でトラブルが発生した場合は、サポートセンターにご連絡いただければ、特例として返金対応を検討いたします。",
        },
      ],
    },
    {
      name: "講師について",
      icon: Shield,
      questions: [
        {
          q: "講師の資格は確認されていますか？",
          a: "全ての講師は運転免許証による本人確認と、教習経験の審査を経て登録されています。",
        },
        {
          q: "講師を変更できますか？",
          a: "はい、相性が合わない場合は別の講師を選択して予約することができます。",
        },
        {
          q: "女性講師を指名できますか？",
          a: "講師検索で性別フィルターを使用して、女性講師のみを表示することができます。",
        },
        {
          q: "外国語で対応できるサポーターはいますか？",
          a: "はい、英語・中国語・韓国語・ベトナム語など、多言語対応のサポーターが在籍しています。検索時に言語でフィルタリングできます。",
        },
        {
          q: "サポーターと連絡先を交換してもいいですか？",
          a: "プラットフォーム外での直接連絡・取引は禁止しています。次回予約もアプリ内でお願いします。",
        },
      ],
    },
    {
      name: "レッスンについて",
      icon: Car,
      questions: [
        {
          q: "免許を取ってから10年以上運転していませんが大丈夫ですか？",
          a: "大丈夫です。多くのサポーターがペーパードライバー指導に慣れています。予約時に「運転ブランク10年以上」と伝えていただければ、基礎から丁寧に指導します。",
        },
        {
          q: "AT限定免許ですが利用できますか？",
          a: "はい、利用できます。サポーターの多くはAT車を用意しています。検索時に「AT車」でフィルタリングできます。",
        },
        {
          q: "自分の車で練習したいのですが、可能ですか？",
          a: "可能です。ただし、任意保険に加入していること、他者運転時の補償があることが条件となります。詳しくは「車両について」をご確認ください。",
        },
        {
          q: "高速道路の練習もできますか？",
          a: "はい、できます。高速道路料金は実費負担となります。予約時に「高速道路練習希望」と記載してください。",
        },
        {
          q: "レッスン時に必要な物はありますか？",
          a: "有効な運転免許証が必須です。また、運転しやすい服装と靴でお越しください。",
        },
        {
          q: "雨の日はどうなりますか？",
          a: "悪天候の場合は講師と相談の上、日程変更が可能です。安全を最優先します。",
        },
      ],
    },
    {
      name: "アカウント・登録について",
      icon: MessageCircle,
      questions: [
        {
          q: "会員登録は無料ですか？",
          a: "はい、会員登録は無料です。レッスンを予約・受講した際に料金が発生します。",
        },
        {
          q: "登録情報の変更はどこからできますか？",
          a: "マイページの「設定」から、プロフィール情報や支払い方法を変更できます。",
        },
        {
          q: "退会したい場合はどうすればいいですか？",
          a: "マイページの設定から退会手続きができます。予約中のレッスンがある場合は、それらを完了してからの退会となります。",
        },
        {
          q: "個人情報は安全に管理されていますか？",
          a: "SSL暗号化通信により、お客様の個人情報を安全に保護しています。",
        },
      ],
    },
  ]

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  let globalIndex = 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">よくある質問</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            お客様からよくいただくご質問をまとめました
          </p>

          {/* 検索バー */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="質問を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* カテゴリー別FAQ */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{category.name}</h2>
              </div>

              <div className="space-y-3">
                {category.questions.map((item) => {
                  const currentIndex = globalIndex++
                  return (
                    <Card
                      key={currentIndex}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => toggleQuestion(currentIndex)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2 flex items-start gap-2">
                              <span className="text-primary shrink-0">Q.</span>
                              <span>{item.q}</span>
                            </h3>
                            {openIndex === currentIndex && (
                              <div className="mt-3 pl-6 text-muted-foreground text-sm leading-relaxed">
                                <span className="text-primary font-semibold">A. </span>
                                {item.a}
                              </div>
                            )}
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                              openIndex === currentIndex ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">該当する質問が見つかりませんでした</p>
            </div>
          )}
        </div>

        {/* お問い合わせCTA */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/20 border-primary/20">
            <CardContent className="py-8 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">解決しない場合は</h3>
              <p className="text-muted-foreground mb-6">
                その他のご質問やお困りの点がございましたら、お気軽にお問い合わせください
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/guide">ご利用ガイド</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/">講師を探す</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
