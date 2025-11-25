"use client"

import { useEffect, useState } from "react"
import { Bell, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Package, Users, X } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  fullName: string
  role: string
  profilePicture?: string
}

export function Header() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const fetchUser = async () => {
    if (!userId) return
    try {
      const response = await axiosInstance.get(`/api/v1/user/${userId}`, {
        headers: { accept: "*/*" },
      })

      if (response.data.isSuccess) {
        setUser(response.data.output)
      } else {
        toast.error(response.data.message || "Failed to fetch user")
      }
    } catch (err: any) {
      console.error("Fetch User Error:", err)
      toast.error(err.response?.data?.message || "Failed to fetch user")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  // notifications sample
  const notifications = [
    {
      id: 1,
      title: "New vendor request",
      message: "Fresh Mart Store requested 50kg tomatoes",
      time: "2 minutes ago",
      type: "order",
      unread: true,
    },
    {
      id: 2,
      title: "Order confirmed",
      message: "Your order #ORD789 has been confirmed",
      time: "1 hour ago",
      type: "confirmation",
      unread: true,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-4 w-4 text-orange-600" />
      case "confirmation":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "alert":
        return <Clock className="h-4 w-4 text-red-600" />
      case "payment":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "trending":
        return <Users className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // role → profile page mapping
  const getProfilePath = (role?: string) => {
    switch (role) {
      case "Admin":
        return "/admin/profile"
      case "Vendor":
        return "/vendor/profile"
      case "Farmer":
        return "/farmer/profile"
      default:
        return "/profile" // fallback
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
       

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt="User" />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {loading ? "Loading..." : user?.fullName || "Unknown User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {loading ? "Loading..." : user?.role || "Role"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={getProfilePath(user?.role)}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
