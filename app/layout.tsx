import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import "./globals.css"

// Fonts are loaded via CSS for offline compatibility

export const metadata: Metadata = {
  title: "Re:Drive | ペーパードライバー講習マッチング",
  description:
    "あなたにぴったりの講師を見つけて、安心して運転を再開しましょう。Re:Driveで経験豊富な講師から選んで予約できます。",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
