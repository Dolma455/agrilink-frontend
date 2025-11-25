"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, TrendingUp, Calendar, ShoppingBag, Search, Filter, Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { format } from "date-fns"

interface SaleItem {
  saleId: string
  productId: string
  productName: string
  productImageUrl?: string
  quantitySold: number
  price: number
  totalSaleAmount: number
  soldAt: string
  imageLoading?: boolean
  imageError?: boolean
}

interface VendorRevenueResponse {
  data: SaleItem[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  totalOrders: number
}

export default function VendorRevenuePage() {
  const [response, setResponse] = useState<VendorRevenueResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const vendorId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const fetchRevenue = async (page: number = 1) => {
    if (!vendorId) return

    setLoading(true)
    try {
      const params: Record<string, any> = {
        page,
        pageSize,
      }

      // Only add filters if they have value
      if (searchTerm.trim()) params.search = searchTerm.trim()
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate

      const res = await axiosInstance.get(`/api/v1/revenue/vendor/${vendorId}`, { params })
      // Initialize image loading states
      const dataWithImageStates = (res.data.data || []).map((item: SaleItem) => ({
        ...item,
        imageLoading: true,
        imageError: false,
      }))
      setResponse({ ...res.data, data: dataWithImageStates })
      setCurrentPage(res.data.currentPage || 1)
    } catch (err: any) {
      console.error("Failed to fetch vendor revenue:", err.response?.data || err.message)
      setResponse(null)
    } finally {
      setLoading(false)
    }
  }

  // Load on mount + page change
  useEffect(() => {
    fetchRevenue(currentPage)
  }, [currentPage, vendorId])

  // Debounced search + filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchRevenue(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, fromDate, toDate])

  const items = response?.data || []
  const totalPages = response?.totalPages || 1

  const updateImageState = (saleId: string, updates: Partial<Pick<SaleItem, 'imageLoading' | 'imageError'>>) => {
    setResponse((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        data: prev.data.map((item) =>
          item.saleId === saleId ? { ...item, ...updates } : item
        ),
      }
    })
  }

  if (loading && !response) {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">Loading your sales revenue...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Revenue</h1>
          <p className="text-muted-foreground">Track all your sales and earnings</p>
        </div>
      </div>

      {/* Gradient Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{response?.totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "0"}
            </div>
            <p className="text-xs opacity-90">From all sales</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className ="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{response?.totalOrders || 0}</div>
            <p className="text-xs opacity-90">Completed sales</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className ="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{response?.netProfit.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "0"}
            </div>
            <p className="text-xs opacity-90">After expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sale Value</CardTitle>
            <Package className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹
              {response && response.totalOrders > 0
                ? Math.round(response.totalRevenue / response.totalOrders)
                : 0}
            </div>
            <p className="text-xs opacity-90">Per sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Date Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
         
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFromDate("")
                setToDate("")
                setCurrentPage(1)
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table - 100% same as Farmer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Sales Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {items.length} of {response?.totalCount || 0} sales
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity Sold</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead className="text-right">Total Earned</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {searchTerm || fromDate || toDate
                        ? "No sales match your filters"
                        : "No sales recorded yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.saleId} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="relative w-12 h-12">
                          {item.imageLoading && !item.imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border">
                              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                            </div>
                          )}
                          {item.imageError && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg border">
                              <Package className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <img
                            src={item.productImageUrl || "/placeholder.jpg"}
                            alt={item.productName}
                            className="w-12 h-12 rounded-lg object-cover border"
                            style={{ display: item.imageLoading || item.imageError ? 'none' : 'block' }}
                            onLoad={() => updateImageState(item.saleId, { imageLoading: false, imageError: false })}
                            onError={() => updateImageState(item.saleId, { imageLoading: false, imageError: true })}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            Sale #{item.saleId.slice(0, 8)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.quantitySold.toFixed(2)}</Badge>
                      </TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₹{item.totalSaleAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.soldAt), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Exact same pagination as Farmer Products */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}