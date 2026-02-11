import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold mb-8">利用規約</h1>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-4">第1条（適用）</h2>
            <p className="text-muted-foreground leading-relaxed">
              本規約は、Re:Drive（以下「当サービス」といいます）が提供するペーパードライバー講習マッチングサービスの利用条件を定めるものです。登録ユーザーの皆様（以下「ユーザー」といいます）には、本規約に従って当サービスをご利用いただきます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第2条（利用登録）</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              登録希望者が当サービスの定める方法によって利用登録を申請し、当サービスがこれを承認することによって、利用登録が完了するものとします。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
              <li>本規約に違反したことがある者からの申請である場合</li>
              <li>その他、当サービスが利用登録を相当でないと判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第3条（ユーザーIDおよびパスワードの管理）</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当サービスは、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第4条（禁止事項）</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サービスの内容等、当サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
              <li>
                当サービス、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
              </li>
              <li>当サービスによって得られた情報を商業的に利用する行為</li>
              <li>
                当サービスを経由せずに講師と受講生が直接取引や予約を行う行為（プラットフォーム外での直接予約は規約違反となります）
              </li>
              <li>当サービスの運営を妨害するおそれのある行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正な目的を持って当サービスを利用する行為</li>
              <li>当サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当サービスが許諾しない当サービス上での宣伝、広告、勧誘、または営業行為</li>
              <li>当サービスのサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当サービスが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第5条（本サービスの提供の停止等）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
              <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
              <li>コンピュータまたは通信回線等が事故により停止した場合</li>
              <li>その他、当サービスが本サービスの提供が困難と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第6条（免責事項）</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              当サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              当サービスの利用によって生じた損害について、当サービスに故意または重過失がある場合を除き、一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第7条（サービス内容の変更等）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第8条（利用規約の変更）</h2>
            <p className="text-muted-foreground leading-relaxed">
              当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の本規約は、当サイトに掲載された時点から効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">第9条（準拠法・裁判管轄）</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              本規約の解釈にあたっては、日本法を準拠法とします。
            </p>
            <p className="text-muted-foreground leading-relaxed">
              本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
            </p>
          </section>

          <div className="pt-8 border-t">
            <p className="text-muted-foreground text-sm">制定日：2025年1月1日</p>
          </div>
        </div>
      </div>
    </div>
  )
}
