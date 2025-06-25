"use client"

import type React from "react"

import { VendorSidebar } from "./vendor-sidebar"
import { Header } from "./header"

interface VendorLayoutProps {
  children: React.ReactNode
}

export function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <VendorSidebar />
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
