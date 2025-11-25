"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search, Eye } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

interface InventoryProps {
  id: string
  productId: string
  productName: string
  totalQuantity: number
  unitName: string
  status: string
  inventoryUpdatedAt: string
}

interface InventoryDetail {
  id: string
  productId: string
  productName: string
  productDescription: string
  productImageUrl: string
  categoryName: string
  unitName: string
  totalQuantity: number
  inventoryUpdatedAt: string
  purchases: {
    batchId: string
    quantityPurchased: number
    remainingQuantity: number
    pricePerUnit: number
    purchasedAt: string
    status: string
  }[]
}

export default function VendorInventoryPage() {
  const [inventory, setInventory] = useState<InventoryProps[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)

  const [viewId, setViewId] = useState<string | null>(null)
  const [viewData, setViewData] = useState<InventoryDetail | null>(null)
  const [viewLoading, setViewLoading] = useState(false)

  const vendorId = localStorage.getItem("userId")
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Available", label: "Available" },
    { value: "Hidden", label: "Hidden" },
  ]

  const fetchInventory = async (page: number = 1, size: number = 20) => {
    if (!vendorId) return
    try {
      setLoading(true)
      setError(null)
      const response = await axiosInstance.get(
        `/api/inventory/vendor?vendorId=${vendorId}&page=${page}&pageSize=${size}`
      )
      setInventory(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || 1)
      setPageSize(response.data.pageSize || 20)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || "Failed to load inventory")
      toast.error(err.response?.data?.message || "Failed to load inventory")
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id: string) => {
    setViewId(id)
    setViewLoading(true)
    try {
      const res = await axiosInstance.get(`/api/inventory/${id}`)
      setViewData(res.data.output)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to load inventory details")
      setViewData(null)
    } finally {
      setViewLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory(currentPage, pageSize)
  }, [currentPage, pageSize])

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50/50 space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
                placeholder="Search product..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredInventory.length === 0 ? (
            <p>No inventory found.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.totalQuantity}</TableCell>
                      <TableCell>{item.unitName}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{new Date(item.inventoryUpdatedAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => handleView(item.id)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
  <DialogContent className="w-full max-w-6xl h-[80vh]">
    <DialogHeader>
      <DialogTitle>Inventory Details</DialogTitle>
    </DialogHeader>
    {viewLoading ? (
      <p>Loading details...</p>
    ) : viewData ? (
      <div className="space-y-4 h-full overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={viewData.productImageUrl}
            alt={viewData.productName}
            className="w-32 h-32 md:w-48 md:h-48 object-cover rounded"
          />
          <div className="flex-1 space-y-1">
            <p className="font-bold text-lg">{viewData.productName}</p>
            <p className="text-muted-foreground">{viewData.productDescription}</p>
            <p>Category: {viewData.categoryName}</p>
            <p>Unit: {viewData.unitName}</p>
            <p>Total Quantity: {viewData.totalQuantity}</p>
            <p>Last Updated: {new Date(viewData.inventoryUpdatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <p className="font-bold mb-2">Purchases:</p>
          <div className="overflow-x-auto w-full border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Purchased Quantity</TableHead>
                  <TableHead>Remaining Quantity</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Purchased At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewData.purchases.map(batch => (
                  <TableRow key={batch.batchId}>
                    <TableCell>{batch.batchId}</TableCell>
                    <TableCell>{batch.quantityPurchased}</TableCell>
                    <TableCell>{batch.remainingQuantity}</TableCell>
                    <TableCell>Rs. {batch.pricePerUnit}</TableCell>
                    <TableCell>{new Date(batch.purchasedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{batch.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    ) : (
      <p>No details available.</p>
    )}
    <DialogFooter>
      <Button variant="outline" onClick={() => setViewId(null)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  )
}
