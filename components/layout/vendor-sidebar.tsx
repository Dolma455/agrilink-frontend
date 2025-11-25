"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, 
  Bell, 
  Home, 
  LogOut, 
  Package, 
  Settings, 
  ShoppingCart, 
  Store, 
  Truck,
  Calculator,
  History,
  TrendingUp,
  Inbox,
  List
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/vendor/dashboard",
    icon: Home,
  },
  {
    name: "Market Trends",
    href: "/vendor/market-trend",
    icon: TrendingUp,
  },
  {
    name: "Revenue",
    href: "/vendor/revenue",
    icon: BarChart3,
  },
  {
    name: "Inventory",
    href: "/vendor/products",
    icon: Truck,
    children: [
      { name: "All Inventory", href: "/vendor/products", icon: Package },
      { name: "Sales History", href: "/vendor/products/sales-history", icon: History },
      { name: "EOQ Recommendation", href: "/vendor/eoq", icon: Calculator },
    ]
  },
  {
    name: "My Orders",
    href: "/vendor/orders",
    icon: Store,
    children: [
      { name: "Market Hub", href: "/vendor/orders/market-hub", icon: ShoppingCart },
      { name: "Requests", href: "/vendor/orders/requests", icon: Inbox },
      { name: "All Orders", href: "/vendor/orders", icon: List },
    ]
  },
  {
    name: "Reports & Stats",
    href: "/vendor/reports",
    icon: BarChart3,
  },
]

export function VendorSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold">AgriLink</span>
            <div className="text-xs text-orange-400">Vendor Portal</div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Navigation - Always Expanded Submenus */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const hasChildren = item.children && item.children.length > 0

            return (
              <div key={item.name} className="space-y-1">
                {/* Main Item */}
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white font-medium text-base",
                      isActive && "bg-orange-600 text-white hover:bg-orange-700"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    
                  </Button>
                </Link>

                {/* Always Visible Submenu */}
                {hasChildren && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-700 pl-4">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href
                      const Icon = child.icon || Package

                      return (
                        <Link key={child.href} href={child.href}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all",
                              isChildActive && "text-orange-400 bg-gray-800/70 font-medium shadow-sm"
                            )}
                          >
                            <Icon className="mr-2.5 h-4 w-4" />
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

      <Separator className="bg-gray-800" />

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:bg-red-900/50 hover:text-red-400">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}