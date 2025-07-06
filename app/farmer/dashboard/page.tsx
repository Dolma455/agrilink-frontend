"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Package, ShoppingCart, TrendingUp, Users, DollarSign, AlertTriangle, Plus, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function FarmerDashboard() {
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false)
  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false)
  const [vendorsDialogOpen, setVendorsDialogOpen] = useState(false)
  const [revenueDialogOpen, setRevenueDialogOpen] = useState(false)

  // Sample data for dashboard
  const recentOrders = [
    { month: "Jan", orders: 45 },
    { month: "Feb", orders: 52 },
    { month: "Mar", orders: 48 },
    { month: "Apr", orders: 61 },
    { month: "May", orders: 55 },
    { month: "Jun", orders: 67 },
  ]

  const productSales = [
    { name: "Tomatoes", sales: 120 },
    { name: "Onions", sales: 98 },
    { name: "Potatoes", sales: 86 },
    { name: "Carrots", sales: 74 },
  ]

  // Sample detailed data for popups
  const pendingOrders = [
    { id: "ORD001", vendor: "Fresh Mart", product: "Tomatoes", quantity: "50kg", amount: "Rs.1,500" },
    { id: "ORD002", vendor: "Green Store", product: "Onions", quantity: "30kg", amount: "Rs.1,200" },
    { id: "ORD003", vendor: "Organic Shop", product: "Carrots", quantity: "25kg", amount: "Rs.875" },
  ]

  const lowStockItems = [
    { product: "Onions", current: "5kg", minimum: "20kg", status: "Critical" },
    { product: "Carrots", current: "8kg", minimum: "15kg", status: "Low" },
    { product: "Spinach", current: "3kg", minimum: "10kg", status: "Critical" },
  ]

  const newVendors = [
    { name: "Fresh Mart Store", location: "Delhi", joined: "2 days ago" },
    { name: "Organic Foods Co.", location: "Mumbai", joined: "3 days ago" },
    { name: "Green Valley Market", location: "Pune", joined: "5 days ago" },
  ]

  const revenueBreakdown = [
    { product: "Tomatoes", revenue: "Rs.15,400", percentage: "34%" },
    { product: "Onions", revenue: "Rs.12,200", percentage: "27%" },
    { product: "Potatoes", revenue: "Rs.10,800", percentage: "24%" },
    { product: "Others", revenue: "Rs.6,831", percentage: "15%" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your farm.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/farmer/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/farmer/orders">
              <Eye className="h-4 w-4 mr-2" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-green-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOrdersDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">180</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">24</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setRevenueDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Rs.45,231</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setVendorsDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">156</div>
            <p className="text-xs text-muted-foreground">+23 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
          </CardHeader>
          <CardContent className="">
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(142, 76%, 36%)",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(142, 76%, 36%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(142, 76%, 36%)",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="hsl(142, 76%, 36%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Alerts
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAlertsDialogOpen(true)}>
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Low stock items</span>
              <Badge variant="destructive">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending orders</span>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Expiring products</span>
              <Badge variant="outline">2</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Trending Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Tomatoes</div>
              <div className="text-muted-foreground">15 new requests</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Onions</div>
              <div className="text-muted-foreground">12 new requests</div>
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/farmer/products/trending">
                  <Eye className="h-3 w-3 mr-1" />
                  View All Trending
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Today's Orders</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Revenue Today</span>
              <span className="font-medium">Rs.2,340</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>New Vendors</span>
              <span className="font-medium">3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Dialog */}
      <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alerts & Issues</DialogTitle>
            <DialogDescription>Items that need your attention</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Low Stock Items</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Minimum Required</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.current}</TableCell>
                      <TableCell>{item.minimum}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Critical" ? "destructive" : "secondary"}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Orders Dialog */}
      <Dialog open={ordersDialogOpen} onOpenChange={setOrdersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recent Orders</DialogTitle>
            <DialogDescription>Latest orders from vendors</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Vendors Dialog */}
      <Dialog open={vendorsDialogOpen} onOpenChange={setVendorsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Vendors</DialogTitle>
            <DialogDescription>Recently joined vendors</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newVendors.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>{vendor.location}</TableCell>
                  <TableCell>{vendor.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Revenue Dialog */}
      <Dialog open={revenueDialogOpen} onOpenChange={setRevenueDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Revenue Breakdown</DialogTitle>
            <DialogDescription>Revenue by product category</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueBreakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.revenue}</TableCell>
                  <TableCell>{item.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}
