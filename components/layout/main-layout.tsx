"use client"

import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({children}: MainLayoutProps) {
  return(
    <div className="flex h-screen bg-gray-100">
      <Sidebar/>
      <div className="flex flex-1 flex-col overflow-hidden ml-64">
        <Header/>
        <main className="flex-1 overflwo-auto">{children}</main>
      </div>
    </div>
  )

}