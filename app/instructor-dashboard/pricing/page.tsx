"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function PricingSettingsPage() {
  const router = useRouter()
  const [pricingData, setPricingData] = useState({
    travelFee: true,
    travelFeeAmount: "2000",
    vehicleFee: true,
    vehicleFeeAmount: "3000",
  })

  const handlePricingChange = (field: string, value: string | boolean) => {
    setPricingData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSavePricing = () => {
    alert("料金設定を保存しました")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">料金・オプション設定</h1>
              <p className="text-sm text-muted-foreground">追加料金の管理</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="travelFee"
                    checked={pricingData.travelFee}
                    onChange={(e) => handlePricingChange("travelFee", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="travelFee" className="font-normal">
                    出張料金を設定する
                  </Label>
                </div>

                {pricingData.travelFee && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={pricingData.travelFeeAmount}
                        onChange={(e) => handlePricingChange("travelFeeAmount", e.target.value)}
                        placeholder="0"
                        className="max-w-[150px]"
                      />
                      <span className="text-sm text-muted-foreground">円</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="vehicleFee"
                    checked={pricingData.vehicleFee}
                    onChange={(e) => handlePricingChange("vehicleFee", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="vehicleFee" className="font-normal">
                    教習車使用料を設定する
                  </Label>
                </div>

                {pricingData.vehicleFee && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={pricingData.vehicleFeeAmount}
                        onChange={(e) => handlePricingChange("vehicleFeeAmount", e.target.value)}
                        placeholder="0"
                        className="max-w-[150px]"
                      />
                      <span className="text-sm text-muted-foreground">円</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  キャンセル
                </Button>
                <Button onClick={handleSavePricing}>保存</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
