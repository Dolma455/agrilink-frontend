"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Package, TrendingUp, Calendar, ShoppingBag, Search, Filter } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { format } from "date-fns"

interface RevenueItem {
  orderId: string
  productName: string
  productImageUrl: string
  quantity: number
  unitName: string
  finalPricePerUnit: number
  totalAmount: number
  vendorName: string
  completedAt: string
}

interface RevenueResponse {
  data: RevenueItem[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  totalRevenue: number
  totalOrders: number
  netProfit: number
}

export default function FarmerRevenuePage() {
  const [response, setResponse] = useState<RevenueResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const farmerId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const fetchRevenue = async (page: number = 1, search: string = "") => {
    if (!farmerId) return

    setLoading(true)
    try {
      const params: any = { page, pageSize }
      if (search.trim()) params.search = search.trim()

      const res = await axiosInstance.get(`/api/v1/revenue/farmer/${farmerId}`, { params })
      setResponse(res.data)
      setCurrentPage(res.data.currentPage)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRevenue(currentPage, searchTerm)
  }, [currentPage, farmerId])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchRevenue(1, searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const items = response?.data || []
  const totalPages = response?.totalPages || 1

  if (loading && !response) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Loading revenue...</p>
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
          <p className="text-muted-foreground">Track all your earnings from completed orders</p>
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
            <p className="text-xs opacity-90">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{response?.totalOrders || 0}</div>
            <p className="text-xs opacity-90">Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{response?.netProfit.toLocaleString("en-IN", { maximumFractionDigits: 2 }) || "0"}
            </div>
            <p className="text-xs opacity-90">After deductions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Package className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{response && response.totalOrders > 0 ? Math.round(response.totalRevenue / response.totalOrders) : 0}
            </div>
            <p className="text-xs opacity-90">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product or vendor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Table + EXACT SAME PAGINATION AS PRODUCTS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revenue Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {items.length} of {response?.totalCount || 0} orders
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead className="text-right">Total Earned</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      {searchTerm ? "No orders match your search" : "No revenue yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.orderId} className="hover:bg-muted/50">
                      <TableCell>
                        <img
                          src={item.productImageUrl || "/placeholder.jpg"}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover border"
                          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">#{item.orderId.slice(0, 8)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.vendorName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.quantity.toFixed(2)} {item.unitName}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{item.finalPricePerUnit.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        ₹{item.totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.completedAt), "dd MMM yyyy")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* EXACT SAME PAGINATION AS YOUR PRODUCT TABLE */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}