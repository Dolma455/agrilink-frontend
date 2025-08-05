"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"

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

interface ApiResponse {
  isSuccess: boolean
  message: string | null
  data: Order[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const vendorId = "019837a2-6d84-78f8-a691-42fca40ad358" // Adjust if needed

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get<ApiResponse>("/api/order", {
          params: { farmerId: vendorId }, // Adjust param name if needed
        })
        if (response.data.isSuccess) {
          setOrders(response.data.data || [])
        } else {
          toast.error("Failed to fetch orders")
        }
      } catch (error) {
        console.error("Failed to fetch orders", error)
        toast.error("Error fetching orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      Confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-800" },
      InTransit: { label: "In Transit", color: "bg-blue-100 text-blue-800" },
      Delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
      Cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      Completed: { label: "Completed", color: "bg-teal-100 text-teal-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={`px-2 py-1 rounded ${config.color} font-medium`}>
        {config.label}
      </Badge>
    )
  }

  const handleCompleteOrder = async () => {
    if (!selectedOrder || selectedOrder.status !== "Delivered") return

    try {
      const response = await axiosInstance.patch(
        "/api/order/complete",
        {
          orderId: selectedOrder.id,
          vendorId: vendorId,
          status: "Completed",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      if (response.data?.isSuccess) {
        toast.success(response.data.message || "Order completed successfully")
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id ? { ...order, status: "Completed" } : order
          )
        )
        setIsDialogOpen(false)
        setSelectedOrder(null)
      } else {
        toast.error(response.data?.message || "Failed to complete order")
      }
    } catch (error: any) {
      console.error("Failed to complete order", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.response?.config?.url,
      })
      toast.error("Failed to complete order")
    }
  }

  const canUpdate = selectedOrder?.status === "Delivered"

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Orders</h1>
          <p className="text-muted-foreground">View and update your order statuses.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders.length})</CardTitle>
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
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ordered At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>
                          {order.quantity} {order.unitName}
                        </TableCell>
                        <TableCell>Rs. {order.finalPricePerUnit}/unit</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{new Date(order.orderedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={isDialogOpen && selectedOrder?.id === order.id}
                            onOpenChange={(open) => {
                              setIsDialogOpen(open)
                              if (!open) setSelectedOrder(null) // clear on close
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setIsDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>Order Details</DialogTitle>
                              {selectedOrder && (
                                <div className="space-y-3">
                                  <img
                                    src={selectedOrder.productImageUrl}
                                    alt={selectedOrder.productName}
                                    className="w-full h-48 object-cover rounded-md"
                                    onError={(e) =>
                                      (e.currentTarget.src = "/placeholder.jpg")
                                    }
                                  />
                                  <p>
                                    <strong>Product:</strong> {selectedOrder.productName}
                                  </p>
                                  <p>
                                    <strong>Quantity:</strong> {selectedOrder.quantity}{" "}
                                    {selectedOrder.unitName}
                                  </p>
                                  <p>
                                    <strong>Price:</strong> Rs. {selectedOrder.finalPricePerUnit}/unit
                                  </p>
                                  <p>
                                    <strong>Total:</strong> Rs. {selectedOrder.totalPrice}
                                  </p>
                                  <p>
                                    <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                                  </p>

                                  <Label>Update Status</Label>
                                  <Select
                                    value={"Completed"}
                                    disabled={!canUpdate}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <Button
                                    onClick={handleCompleteOrder}
                                    className="mt-2"
                                    disabled={!canUpdate}
                                  >
                                    Update Status
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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