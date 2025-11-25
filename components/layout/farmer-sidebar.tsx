"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { BarChart3, Bell, Home, LogOut, Package, Settings, ShoppingCart, Sprout, Store } from "lucide-react"

type NavChild = { name: string; href: string }
type NavItem = {
  name: string
  href: string
  icon: React.ElementType
  children?: NavChild[]
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/farmer/dashboard",
    icon: Home,
  },
  {
    name: "Revenue",
    href: "/farmer/revenue",
    icon: BarChart3,
  },
  {
    name: "Order Management",
    href: "/farmer/orders",
    icon: ShoppingCart,
    children: undefined,
  },
  {
    name: "Product Management",
    href: "/farmer/products",
    icon: Package,
    children: undefined,
  },
  {
    name: "Reports & Stats",
    href: "/farmer/reports",
    icon: BarChart3,
  },
]

export function Sidebar({ userRole = "farmer" }: { userRole?: "farmer" | "vendor" }) {
  const pathname = usePathname()

  // Adjust navigation links based on user role
  const adjustedNavigation = navigation.map((item) => {
    const baseHref = item.href.replace("/farmer/", `/${userRole}/`)
    let children

    if (item.name === "Order Management") {
      children =
        userRole === "farmer"
          ? [
              { name: "All Orders", href: `/${userRole}/orders` },
              { name: "Market Hub", href: `/${userRole}/orders/market-hub` },
            ]
          : [
              { name: "All Orders", href: `/${userRole}/orders` },
              { name: "Place Order", href: `/${userRole}/orders/place-order` },
              { name: "Farmer Requests", href: `/${userRole}/orders/farmer-requests` },
            ]
    } else if (item.name === "Product Management") {
      children =
        userRole === "farmer"
          ? [
              { name: "All Products", href: `/${userRole}/products` },
            ]
          : [
              { name: "Browse Products", href: `/${userRole}/products` },

            ]
    } else if (item.children) {
      children = item.children.map((child) => ({
        ...child,
        href: child.href.replace("/farmer/", `/${userRole}/`),
      }))
    }

    return {
      ...item,
      href: baseHref,
      children,
    }
  })

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              userRole === "farmer" ? "bg-green-600" : "bg-orange-600",
            )}
          >
            {userRole === "farmer" ? (
              <Sprout className="h-5 w-5 text-white" />
            ) : (
              <Store className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <span className="text-lg font-bold">AgriLink</span>
            <div className={cn("text-xs", userRole === "farmer" ? "text-green-400" : "text-orange-400")}>
              {userRole === "farmer" ? "Farm Platform" : "Vendor Platform"}
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {adjustedNavigation.map((item) => {
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
                      isActive && userRole === "farmer" && "bg-green-600 text-white hover:bg-green-700",
                      isActive && userRole === "vendor" && "bg-orange-600 text-white hover:bg-orange-700",
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
                              isChildActive && userRole === "farmer" && "bg-green-600 text-white hover:bg-green-700",
                              isChildActive && userRole === "vendor" && "bg-orange-600 text-white hover:bg-orange-700",
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
