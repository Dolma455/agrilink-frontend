"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Calendar,
  CheckCircle,
  Package,
  PackageX,
  TrendingUp,
  Users,
  X,
} from "lucide-react"

export default function Notifications() {
  // Change this to "farmer" or "vendor"
  const [userRole] = useState<"farmer" | "vendor">("vendor")

  // Notification content for farmer
  const farmerNotifications = [
    {
      id: 1,
      title: "New vendor requests",
      message: "Your product Tomatoes was requested by 2 vendors.",
      time: "2 minutes ago",
      read: false,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      title: "Product expiry warning",
      message: "Your product Beans is nearing its availability end date.",
      time: "1 hour ago",
      read: false,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      title: "Product sold out",
      message: "Product Onions is now marked as Sold Out.",
      time: "3 hours ago",
      read: false,
      icon: PackageX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      id: 4,
      title: "Trending product",
      message: "Your product Potatoes is trending with 15 new requests today.",
      time: "5 hours ago",
      read: true,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  // Notification content for vendor
  const vendorNotifications = [
    {
      id: 101,
      title: "New stock available",
      message: "Fresh Tomatoes from Raju Lama are now available.",
      time: "Just now",
      read: false,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 102,
      title: "Delivery delay alert",
      message: "Your Beans delivery from Gita Rai will be delayed by 1 day.",
      time: "30 minutes ago",
      read: false,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 103,
      title: "Order confirmed",
      message: "Your order for 50kg Potatoes from Shyam BK has been confirmed.",
      time: "2 hours ago",
      read: true,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 104,
      title: "Order cancelled",
      message: "Farmer Sunita cancelled the delivery of Onions due to rain.",
      time: "1 day ago",
      read: true,
      icon: PackageX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  // Load appropriate content
  const [notifications, setNotifications] = useState(
    userRole === "farmer" ? farmerNotifications : vendorNotifications
  )

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((n) => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(
      notifications.filter((n) => n.id !== id)
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              {userRole === "vendor"
                ? "View your stock, delivery and order updates"
                : "Stay updated with your product activity"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="sticky top-0 z-10 bg-white">
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              {userRole === "vendor"
                ? "Your vendor updates"
                : "Your product and request updates"}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {notifications.map((notification, index) => {
              const Icon = notification.icon
              return (
                <div key={notification.id}>
                  <div
                    className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                      !notification.read ? notification.bgColor : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${notification.bgColor}`}>
                      <Icon className={`h-5 w-5 ${notification.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-2" />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground text-center">
                You're all caught up! New notifications will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
