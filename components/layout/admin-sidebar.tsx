"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bell, Home, LogOut,ShoppingCart, Truck, User } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    name: "Product Management",
    href: "/admin/products",
    icon: Truck,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: User,
  },

  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">AgriLink</span>
            <div className="text-xs text-green-400">Admin Portal</div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <div key={item.name}>
                {/* Main Navigation Item */}
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
                      isActive && "bg-green-600 text-white hover:bg-green-700",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                  </Button>
                </Link>
              </div>
            )
          })}
        </nav>
      </ScrollArea>
      <Separator className="bg-gray-700" />
      {/* Bottom section */}
      <div className="p-3 space-y-2">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-red-600 hover:text-white">
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
