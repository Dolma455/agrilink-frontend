"use client"

import { AdminHeader } from "./admin-header"
import { AdminSidebar } from "./admin-sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({children}: MainLayoutProps) {
  return(
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar/>
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <AdminHeader/>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )

}