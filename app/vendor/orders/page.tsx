"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Eye, Filter, Package, Search } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"

interface Order {
  id: string
  marketProposalId: string
  vendorId: string
  vendorName: string
  farmerId: string
  farmerName: string
  farmerBusinessName: string
  quantity: number
  finalPricePerUnit: number
  deliveryCharge: number
  totalPrice: number
  status: string
  orderedAt: string
  completedAt: string | null
  productId: string
  productName: string
  productImageUrl: string
  unitName: string
  categoryName: string
}

export default function VendorOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/api/order", {
          params: {
            farmerId: "019837a2-6d84-78f8-a691-42fca40ad358",
            vendorId: "01983fcf-2a08-7546-9503-c90803cfc607",
          },
        })
        setOrders(response.data.data || [])
      } catch (err: any) {
        console.error("Fetch Orders Error:", err)
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [refreshKey])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { label: "Pending", variant: "default" as const, icon: Package, color: "bg-yellow-100 text-yellow-800" },
      Completed: { label: "Completed", variant: "default" as const, icon: Package, color: "bg-green-100 text-green-800" },
      InTransit: { label: "In Transit", variant: "default" as const, icon: Package, color: "bg-blue-100 text-blue-800" },
      Confirmed: { label: "Confirmed", variant: "default" as const, icon: Package, color: "bg-purple-100 text-purple-800" },
      
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesDate = true
    if (dateFilter !== "all") {
      const orderDate = new Date(order.orderedAt)
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
    return matchesSearch && matchesDate
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">All your orders with farmers</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Product"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
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
            {isLoading ? (
              <p>Loading orders...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Final Price</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ordered At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>
                          {order.quantity} {order.unitName}
                        </TableCell>
                        <TableCell>Rs. {order.finalPricePerUnit}/unit</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.farmerName}</div>
                            <div className="text-xs text-muted-foreground">{order.farmerBusinessName}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.orderedAt).toLocaleDateString()}</TableCell>
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
                                      src={selectedOrder.productImageUrl}
                                      alt={selectedOrder.productName}
                                      className="w-full h-48 object-cover rounded-md"
                                    />
                                    <p>
                                      <strong>Product:</strong> {selectedOrder.productName}
                                    </p>
                                    <p>
                                      <strong>Quantity:</strong> {selectedOrder.quantity} {selectedOrder.unitName}
                                    </p>
                                    <p>
                                      <strong>Final Price:</strong> Rs. {selectedOrder.finalPricePerUnit}/unit
                                    </p>
                                    <p>
                                      <strong>Total Price:</strong> Rs. {selectedOrder.totalPrice}
                                    </p>
                                    <p>
                                      <strong>Farmer:</strong> {selectedOrder.farmerName} ({selectedOrder.farmerBusinessName})
                                    </p>
                                    <p>
                                      <strong>Status:</strong> {selectedOrder.status}
                                    </p>
                                    <p>
                                      <strong>Ordered At:</strong> {new Date(selectedOrder.orderedAt).toLocaleString()}
                                    </p>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
