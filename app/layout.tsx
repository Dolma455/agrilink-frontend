import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriLink - Smart Farm-to-Market Platform",
  description: "Connect, manage, and grow your agricultural business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  )
}
