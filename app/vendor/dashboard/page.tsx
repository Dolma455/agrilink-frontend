"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { Package, ShoppingCart, TrendingUp, Users, DollarSign, AlertTriangle, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function VendorDashboard() {
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false)
  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false)
  const [farmersDialogOpen, setFarmersDialogOpen] = useState(false)
  const [spendingDialogOpen, setSpendingDialogOpen] = useState(false)

  // Sample data for dashboard
  const monthlyOrders = [
    { month: "Jan", orders: 25 },
    { month: "Feb", orders: 32 },
    { month: "Mar", orders: 28 },
    { month: "Apr", orders: 41 },
    { month: "May", orders: 35 },
    { month: "Jun", orders: 47 },
  ]

  const topProducts = [
    { name: "Tomatoes", orders: 45 },
    { name: "Onions", orders: 38 },
    { name: "Potatoes", orders: 32 },
    { name: "Carrots", orders: 28 },
  ]

  // Sample detailed data for popups
  const recentOrders = [
    { id: "ORD001", farmer: "Raj Kumar", product: "Tomatoes", quantity: "50kg", amount: "Rs.1,500" },
    { id: "ORD002", farmer: "Sita Devi", product: "Onions", quantity: "30kg", amount: "Rs.1,200" },
    { id: "ORD003", farmer: "Mohan Singh", product: "Carrots", quantity: "25kg", amount: "Rs.875" },
  ]

  const pendingDeliveries = [
    { product: "Tomatoes", quantity: "50kg", farmer: "Raj Kumar", status: "In Transit" },
    { product: "Onions", quantity: "30kg", farmer: "Sita Devi", status: "Processing" },
    { product: "Potatoes", quantity: "80kg", farmer: "Ram Prasad", status: "Confirmed" },
  ]

  const topFarmers = [
    { name: "Raj Kumar", location: "Punjab", orders: "15", rating: "4.8" },
    { name: "Sita Devi", location: "Haryana", orders: "12", rating: "4.9" },
    { name: "Mohan Singh", location: "Punjab", orders: "10", rating: "4.7" },
  ]

  const spendingBreakdown = [
    { category: "Vegetables", amount: "Rs.25,400", percentage: "45%" },
    { category: "Fruits", amount: "Rs.15,200", percentage: "27%" },
    { category: "Grains", amount: "Rs.10,800", percentage: "19%" },
    { category: "Others", amount: "Rs.5,050", percentage: "9%" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/vendor/orders">
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
              <ShoppingCart className="h-4 w-4 text-orange-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOrdersDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">89</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSpendingDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Rs.1,23,450</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Farmers</CardTitle>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-600" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setFarmersDialogOpen(true)}>
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">42</div>
            <p className="text-xs text-muted-foreground">+5 new this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(24, 95%, 53%)",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(24, 95%, 53%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Ordered Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(24, 95%, 53%)",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="hsl(24, 95%, 53%)" />
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
              <span className="text-sm">Pending confirmations</span>
              <Badge variant="destructive">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delayed deliveries</span>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">2</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Payment pending</span>
              <Badge variant="outline">3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Trending Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">Fresh Tomatoes</div>
              <div className="text-muted-foreground">Rs.30/kg - 5 farmers</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Organic Onions</div>
              <div className="text-muted-foreground">Rs.40/kg - 3 farmers</div>
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/vendor/products/trending">
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
              <span>Orders today</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Spent today</span>
              <span className="font-medium">Rs.1,240</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>New farmers</span>
              <span className="font-medium">2</span>
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
              <h4 className="font-medium mb-2">Pending Deliveries</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeliveries.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.farmer}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "In Transit"
                              ? "secondary"
                              : item.status === "Processing"
                                ? "outline"
                                : "default"
                          }
                        >
                          {item.status}
                        </Badge>
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
            <DialogDescription>Latest orders from farmers</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.farmer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Farmers Dialog */}
      <Dialog open={farmersDialogOpen} onOpenChange={setFarmersDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top Farmers</DialogTitle>
            <DialogDescription>Your most frequent suppliers</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farmer Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topFarmers.map((farmer, index) => (
                <TableRow key={index}>
                  <TableCell>{farmer.name}</TableCell>
                  <TableCell>{farmer.location}</TableCell>
                  <TableCell>{farmer.orders}</TableCell>
                  <TableCell>{farmer.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Spending Dialog */}
      <Dialog open={spendingDialogOpen} onOpenChange={setSpendingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Spending Breakdown</DialogTitle>
            <DialogDescription>Spending by product category</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendingBreakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.amount}</TableCell>
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
