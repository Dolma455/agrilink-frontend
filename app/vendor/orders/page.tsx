"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock, Eye, Filter, Package, Plus, Search, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function VendorOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  type Order = {
    id: string
    product: string
    quantity: string
    requestedPrice: string
    totalAmount: string
    status: string
    requestDate: string
    farmer: string
    farmName: string
    location: string
    expectedDelivery: string
    productImage: string
  }
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderList, setOrderList] = useState([
    {
      id: "ORD001",
      product: "Tomatoes",
      quantity: "50kg",
      requestedPrice: "Rs.30/kg",
      totalAmount: "Rs.1,500",
      status: "pending",
      requestDate: "2024-01-15",
      farmer: "Raj Kumar",
      farmName: "Green Valley Farm",
      location: "Punjab",
      expectedDelivery: "2024-01-18",
      productImage: "/assets/images/tomatoes.jpg?height=200&width=200"
    },
    {
      id: "ORD002",
      product: "Onions",
      quantity: "30kg",
      requestedPrice: "Rs.40/kg",
      totalAmount: "Rs.1,200",
      status: "pending",
      requestDate: "2024-01-14",
      farmer: "Sita Devi",
      farmName: "Organic Fields",
      location: "Haryana",
      expectedDelivery: "2024-01-17",
      productImage: "/assets/images/onions.jpg?height=200&width=200"
    },
    {
      id: "ORD003",
      product: "Potatoes",
      quantity: "80kg",
      requestedPrice: "Rs.25/kg",
      totalAmount: "Rs.2,000",
      status: "delivered",
      requestDate: "2024-01-12",
      farmer: "Ram Prasad",
      farmName: "Hill View Farm",
      location: "Himachal Pradesh",
      expectedDelivery: "2024-01-15",
      productImage: "/assets/images/potatoes.jpg?height=200&width=200"
    },
    {
      id: "ORD004",
      product: "Carrots",
      quantity: "25kg",
      requestedPrice: "Rs.35/kg",
      totalAmount: "Rs.875",
      status: "delivered",
      requestDate: "2024-01-13",
      farmer: "Multiple Farmers",
      farmName: "Various",
      location: "Various",
      expectedDelivery: "-",
      productImage: "/assets/images/carrots.jpg?height=200&width=200"
    },
    {
      id: "ORD005",
      product: "Rice",
      quantity: "100kg",
      requestedPrice: "Rs.45/kg",
      totalAmount: "Rs.4,500",
      status: "pending",
      requestDate: "2024-01-16",
      farmer: "Mohan Singh",
      farmName: "Golden Grains",
      location: "Punjab",
      expectedDelivery: "2024-01-19",
      productImage: "/assets/images/rice.jpg?height=200&width=200"
    },
  ])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock, color: "" },
      delivered: { label: "Delivered", variant: "default" as const, icon: Package, color: "bg-green-100 text-green-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color || ""}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orderList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.farmer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const orderDate = new Date(order.requestDate)
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString()
      } else if (dateFilter === "week") {
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= lastWeek
      } else if (dateFilter === "month") {
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= lastMonth
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDelete = (id: string) => {
    const updatedOrders = orderList.filter(order => order.id !== id)
    setOrderList(updatedOrders)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-6 space-y-6">
         {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track all your product orders and requests</p>
          </div>
          <Button asChild className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white" >
              <Link href="/vendor/orders/place-order">
                <Plus className="h-4 w-4" />
                Place Order
              </Link>
            </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Order ID / Product / Farmer"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDateFilter("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.requestedPrice}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.farmer}</div>
                          <div className="text-sm text-muted-foreground">{order.farmName}</div>
                          <div className="text-xs text-muted-foreground">{order.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-1" />
                              </Button>
                              
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>Order Details</DialogTitle>
                              {selectedOrder && (
                                <div className="space-y-2">
                                  <img
                                    src={selectedOrder.productImage}
                                    alt="product"
                                    className="w-full h-48 object-cover rounded-md"
                                  />
                                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                  <p><strong>Product:</strong> {selectedOrder.product}</p>
                                  <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                  <p><strong>Price/Unit:</strong> {selectedOrder.requestedPrice}</p>
                                  <p><strong>Total:</strong> {selectedOrder.totalAmount}</p>
                                  <p><strong>Farmer:</strong> {selectedOrder.farmer}</p>
                                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                                  <p><strong>Request Date:</strong> {selectedOrder.requestDate}</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <Button variant="ghost" size="sm" onClick={() => handleDelete(order.id)}>
                            <Trash className="h-4 w-4 text-destructive"/>
                          </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}