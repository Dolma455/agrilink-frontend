"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Eye, AlertTriangle } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const vendorId = localStorage.getItem("userId")

  const fetchOrders = async (page: number = 1, size: number = 10) => {
    if (!vendorId) {
      setError("User not logged in. Please log in to view orders.")
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get<ApiResponse>("/api/order", {
        headers: { "x-vendor-id": vendorId },
        params: { page, pageSize: size },
      })
      console.log("Fetch Orders Response:", {
        status: response.status,
        data: response.data,
        url: "/api/order",
        vendorId,
        page,
        pageSize: size,
      })
      if (response.data.isSuccess) {
        setOrders(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
        setCurrentPage(response.data.currentPage || 1)
        setPageSize(response.data.pageSize || 10)
      } else {
        setError(response.data.message || "Failed to fetch orders")
        toast.error(response.data.message || "Failed to fetch orders")
      }
    } catch (error: any) {
      console.error("Fetch Orders Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.response?.config?.url,
      })
      setError(error.response?.data?.message || "Error fetching orders")
      toast.error(error.response?.data?.message || "Error fetching orders")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, pageSize)
  }, [vendorId, router, currentPage, pageSize])

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
          headers: { "Content-Type": "application/json", "x-vendor-id": vendorId },
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
        fetchOrders(currentPage, pageSize) // Refresh with current pagination
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
      toast.error(error.response?.data?.message || "Failed to complete order")
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const canUpdate = selectedOrder?.status === "Delivered"

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null)
              setIsLoading(true)
              fetchOrders(currentPage, pageSize)
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">You have no orders at the moment.</p>
        </div>
      </div>
    )
  }

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
                            if (!open) setSelectedOrder(null)
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
                                <p>
                                  <strong>Farmer:</strong> {selectedOrder.farmerBusinessName} ({selectedOrder.farmerName})
                                </p>

                                <Label>Update Status</Label>
                                <Select
                                  value="Completed"
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
            <div className="flex justify-between items-center mt-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                variant="outline"
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}