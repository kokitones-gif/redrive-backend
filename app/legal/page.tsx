import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            トップに戻る
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

        <div className="space-y-6 text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">販売事業者名</div>
            <div className="md:col-span-3 text-muted-foreground">株式会社tones</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">代表者名</div>
            <div className="md:col-span-3 text-muted-foreground">代表取締役 吉見厚輝</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">所在地</div>
            <div className="md:col-span-3 text-muted-foreground">
              大阪市北区浪花町13-40-5F
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">電話番号</div>
            <div className="md:col-span-3 text-muted-foreground">080-8346-9617</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">メールアドレス</div>
            <div className="md:col-span-3 text-muted-foreground">info@tones.co.jp</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">運営統括責任者</div>
            <div className="md:col-span-3 text-muted-foreground">吉見厚輝</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">サービス名</div>
            <div className="md:col-span-3 text-muted-foreground">Re:Drive</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">販売価格</div>
            <div className="md:col-span-3 text-muted-foreground">
              各サービスページに記載の通り
              <br />
              <span className="text-sm">※価格は全て税込表示です</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">商品代金以外の必要料金</div>
            <div className="md:col-span-3 text-muted-foreground">
              インターネット接続料金、通信料金等はお客様のご負担となります。
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">支払方法</div>
            <div className="md:col-span-3 text-muted-foreground">
              クレジットカード決済
              <br />
              <span className="text-sm">（VISA、MasterCard、JCB、American Express、Diners Club）</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">支払時期</div>
            <div className="md:col-span-3 text-muted-foreground">
              クレジットカード決済：各クレジットカード会社の規約に基づきます
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">サービス提供時期</div>
            <div className="md:col-span-3 text-muted-foreground">
              予約確定後、指定された日時にサービスを提供いたします。
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">返品・キャンセル</div>
            <div className="md:col-span-3 text-muted-foreground">
              <p className="mb-2 font-medium text-foreground">キャンセルポリシー：</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <span className="font-medium">コース（複数回）購入の場合</span>
                  <ul className="list-none ml-5 mt-1 space-y-1 text-muted-foreground">
                    <li>・予約から1週間以内：キャンセル可能（全額返金）</li>
                    <li>・初回予約確定後：キャンセル不可</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium">単発予約の場合</span>
                  <ul className="list-none ml-5 mt-1 space-y-1 text-muted-foreground">
                    <li>・予約確定後のキャンセルは不可</li>
                  </ul>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">特例について</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  講師と受講生間でトラブルが発生した場合は、サポートセンターにご連絡ください。状況を確認の上、返金対応を検討いたします。
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b">
            <div className="font-semibold">不良品について</div>
            <div className="md:col-span-3 text-muted-foreground">
              サービス提供に瑕疵があった場合は、速やかにカスタマーサポートまでご連絡ください。状況に応じて、サービスの再提供または返金対応をいたします。
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6">
            <div className="font-semibold">お問い合わせ</div>
            <div className="md:col-span-3 text-muted-foreground">
              お問い合わせは、メール（info@tones.co.jp）またはお問い合わせフォームよりお願いいたします。
              <br />
              <span className="text-sm">営業時間：平日9:00〜18:00（土日祝日を除く）</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
