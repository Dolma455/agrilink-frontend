"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Bell, Home, LogOut, Package, Settings, ShoppingCart, Store, Truck, User } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: Home,
  },
  {
    name: "Browse Products",
    href: "/vendor/products",
    icon: Package,
  },
  {
    name: "My Orders",
    href: "/vendor/orders",
    icon: ShoppingCart,
    children: [
      { name: "All Orders", href: "/vendor/orders" },
      { name: "Pending", href: "/vendor/orders/pending" },
      { name: "Confirmed", href: "/vendor/orders/confirmed" },
      { name: "Delivered", href: "/vendor/orders/delivered" },
    ],
  },
  {
    name: "Deliveries",
    href: "/vendor/deliveries",
    icon: Truck,
  },
  {
    name: "Vendors Network",
    href: "/vendor/network",
    icon: Store,
  },
  {
    name: "Reports",
    href: "/vendor/reports",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    href: "/vendor/notifications",
    icon: Bell,
  },
  {
    name: "Profile",
    href: "/vendor/profile",
    icon: User,
  },
]

export function VendorSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">AgriLink</span>
            <div className="text-xs text-orange-400">Vendor Portal</div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name}>
                {/* Main Navigation Item */}
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
                      isActive && "bg-orange-600 text-white hover:bg-orange-700",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                  </Button>
                </Link>

                {/* Sub-navigation - Always visible */}
                {hasChildren && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-gray-400 hover:bg-gray-800 hover:text-white",
                              isChildActive && "bg-orange-600 text-white hover:bg-orange-700",
                            )}
                          >
                            {child.name}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-gray-700" />

      {/* Bottom section */}
      <div className="p-3 space-y-2">
        <Link href="/vendor/settings">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </Link>
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
