"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PaymentPage() {
  const [cards, setCards] = useState([
    {
      id: "1",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true,
    },
    {
      id: "2",
      brand: "Mastercard",
      last4: "8888",
      expMonth: 8,
      expYear: 2026,
      isDefault: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  })

  const handleSetDefault = (cardId: string) => {
    setCards(cards.map((card) => ({ ...card, isDefault: card.id === cardId })))
  }

  const handleDelete = (cardId: string) => {
    if (cards.find((c) => c.id === cardId)?.isDefault && cards.length > 1) {
      alert("デフォルトの支払い方法は削除できません。先に別のカードをデフォルトに設定してください。")
      return
    }
    setCards(cards.filter((card) => card.id !== cardId))
  }

  const handleAddCard = () => {
    // 実際のアプリでは決済APIと連携
    const card = {
      id: Date.now().toString(),
      brand: "Visa",
      last4: newCard.number.slice(-4),
      expMonth: Number.parseInt(newCard.expMonth),
      expYear: Number.parseInt(newCard.expYear),
      isDefault: cards.length === 0,
    }
    setCards([...cards, card])
    setShowAddForm(false)
    setNewCard({ number: "", name: "", expMonth: "", expYear: "", cvc: "" })
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
                支払い方法
              </h1>
              <p className="text-muted-foreground">クレジットカードの管理</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 登録済みカード一覧 */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>登録済みカード</CardTitle>
                    <CardDescription>レッスン料金の支払いに使用されます</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    カードを追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cards.map((card) => (
                  <Card key={card.id} className="bg-gradient-to-br from-card to-secondary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <CreditCard className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{card.brand}</h3>
                              {card.isDefault && <Badge variant="default">デフォルト</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">**** **** **** {card.last4}</p>
                            <p className="text-sm text-muted-foreground">
                              有効期限: {card.expMonth.toString().padStart(2, "0")}/{card.expYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!card.isDefault && (
                            <Button variant="ghost" size="sm" onClick={() => handleSetDefault(card.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              デフォルトに設定
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(card.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {cards.length === 0 && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">登録されているカードはありません</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* カード追加フォーム */}
            {showAddForm && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>新しいカードを追加</CardTitle>
                  <CardDescription>安全に暗号化されて保存されます</CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleAddCard()
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">カード番号</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={newCard.number}
                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                        required
                        maxLength={16}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">カード名義</Label>
                      <Input
                        id="cardName"
                        placeholder="TARO YAMADA"
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expMonth">有効期限（月）</Label>
                        <Input
                          id="expMonth"
                          placeholder="12"
                          value={newCard.expMonth}
                          onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                          required
                          maxLength={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expYear">年</Label>
                        <Input
                          id="expYear"
                          placeholder="2025"
                          value={newCard.expYear}
                          onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                          required
                          maxLength={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          value={newCard.cvc}
                          onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1">
                        追加
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowAddForm(false)}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
