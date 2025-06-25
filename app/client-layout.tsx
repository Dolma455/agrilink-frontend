"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { VendorLayout } from "@/components/layout/vendor-layout"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isVendorPage = pathname.startsWith("/vendor")
  const isFarmerPage = pathname.startsWith("/farmer")
  if (isAuthPage) {
    return children
  }

  if (isVendorPage) {
    return <VendorLayout>{children}</VendorLayout>
  }

  if (isFarmerPage) {
    return <MainLayout>{children}</MainLayout>
  }

  return children
}
