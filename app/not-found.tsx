import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-10 pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">ページが見つかりませんでした</h2>
            <p className="text-muted-foreground mb-6">お探しのページは存在しないか、削除された可能性があります。</p>
            <Button asChild>
              <Link href="/">トップページに戻る</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
