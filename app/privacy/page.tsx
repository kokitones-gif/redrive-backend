import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Re:Drive（以下「当サービス」といいます）は、ユーザーの個人情報について以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">1. 個人情報の取得</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              当サービスは、ユーザーから以下の個人情報を取得します。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>氏名</li>
              <li>メールアドレス</li>
              <li>電話番号</li>
              <li>住所</li>
              <li>生年月日</li>
              <li>運転免許証情報（免許証番号、取得年月日、有効期限、免許種別）</li>
              <li>クレジットカード情報</li>
              <li>その他、当サービスが提供するサービスの利用に必要な情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. 個人情報の利用目的</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              当サービスは、取得した個人情報を以下の目的のために利用します。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>当サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに回答するため</li>
              <li>ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等の案内を送付するため</li>
              <li>メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
              <li>
                利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
              </li>
              <li>ユーザーにご自身の登録情報の閲覧や変更、削除、ご利用状況の閲覧を行っていただくため</li>
              <li>有料サービスにおいて、ユーザーに利用料金を請求するため</li>
              <li>上記の利用目的に付随する目的</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. 個人情報の第三者提供</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              当サービスは、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき
              </li>
              <li>
                公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき
              </li>
              <li>
                国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
              </li>
              <li>予め次の事項を告知あるいは公表し、かつ当サービスが個人情報保護委員会に届出をしたとき</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. 個人情報の開示</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合</li>
              <li>当サービスの業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
              <li>その他法令に違反することとなる場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. 個人情報の訂正および削除</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ユーザーは、当サービスの保有する自己の個人情報が誤った情報である場合には、当サービスが定める手続きにより、当サービスに対して個人情報の訂正、追加または削除（以下「訂正等」といいます）を請求することができます。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. 個人情報の利用停止等</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下「利用停止等」といいます）を求められた場合には、遅滞なく必要な調査を行います。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Cookie（クッキー）その他の技術の利用</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスのサービスは、Cookieおよびこれに類する技術を利用することがあります。これらの技術は、当サービスによる当サービスのサービスの利用状況等の把握に役立ち、サービス向上に資するものです。Cookieを無効化されたいユーザーは、ウェブブラウザの設定を変更することによりCookieを無効化することができます。ただし、Cookieを無効化すると、当サービスのサービスの一部の機能をご利用いただけなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. プライバシーポリシーの変更</h2>
            <p className="text-muted-foreground leading-relaxed">
              本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. お問い合わせ窓口</h2>
            <p className="text-muted-foreground leading-relaxed">
              本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p>サービス名：Re:Drive</p>
              <p>メールアドレス：privacy@redrive.example.com</p>
            </div>
          </section>

          <div className="pt-8 border-t">
            <p className="text-muted-foreground text-sm">制定日：2025年1月1日</p>
          </div>
        </div>
      </div>
    </div>
  )
}
