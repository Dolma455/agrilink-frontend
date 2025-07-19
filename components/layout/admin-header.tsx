"use client"

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

export function AdminHeader() {
  // Sample notifications data
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
    {
      id: 3,
      title: "Low stock alert",
      message: "Onions stock is running low (5kg remaining)",
      time: "3 hours ago",
      type: "alert",
      unread: false,
    },
    {
      id: 4,
      title: "Payment received",
      message: "Payment of ₹2,400 received for order #ORD785",
      time: "5 hours ago",
      type: "payment",
      unread: false,
    },
    {
      id: 5,
      title: "New product trending",
      message: "Your tomatoes are trending with 15 new requests",
      time: "1 day ago",
      type: "trending",
      unread: false,
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

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount} new</Badge>}
            </div>
            <ScrollArea className="h-80">
              <div className="p-2">
                {notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 ${notification.unread ? "bg-blue-50" : ""}`}
                    >
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${notification.unread ? "font-semibold" : ""}`}>
                            {notification.title}
                          </p>
                          {notification.unread && <div className="h-2 w-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {index < notifications.length - 1 && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-3 border-t">
              <Button variant="outline" className="w-full" size="sm">
                <Link href="/admin/notifications">
                  View All Notifications
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-green-100 text-green-700">D</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Dolma Lama</p>
                <p className="text-xs leading-none text-muted-foreground">Admin</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
            <Link href="/admin/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
            <Link href="/login">
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-red-600 hover:text-white">
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
