"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Filter, Plus, Search } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import MarketHubCardList from "./MarketHubCardList"
import OrderForm from "./OrderForm"
import { AddProduct } from "@/app/type"

interface MarketHubProduct {
  id: string
  vendorId: string
  productId: string
  productName: string
  quantity: number
  requiredDeliveryDate: string
  location: string
  priceRangeMin: number
  priceRangeMax: number
  additionalInfo: string
  status: string
  createdAt: string
}

interface ApiResponse {
  isSuccess: boolean
  message: string | null
  data: MarketHubProduct[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}

export default function MarketHub() {
  const [products, setProducts] = useState<MarketHubProduct[]>([])
  const [productList, setProductList] = useState<AddProduct[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const vendorId = localStorage.getItem("userId") ?? ""

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
    { value: "Low Stock", label: "Low Stock" },
  ]

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Fruits", label: "Fruits" },
    { value: "Grains", label: "Grains" },
    { value: "Dairy", label: "Dairy" },
    { value: "Hardware", label: "Hardware" },
    { value: "Stationery", label: "Stationery" },
  ]

  const fetchProducts = async (page: number = 1, size: number = 10) => {
    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get<ApiResponse>(`/api/v1/marketHub/vendor?vendorId=${vendorId}&page=${page}&pageSize=${size}`, {
        headers: { accept: "*/*" },
      })
      console.log("Fetch MarketHub Products Response:", {
        status: response.status,
        data: response.data,
        url: `/api/v1/marketHub/vendor?vendorId=${vendorId}&page=${page}&pageSize=${size}`,
        authToken: localStorage.getItem("authToken"),
      })
      setProducts(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || 1)
      setPageSize(response.data.pageSize || 10)
    } catch (err: any) {
      console.error("Fetch MarketHub Products Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `/api/v1/marketHub/vendor?vendorId=${vendorId}&page=${page}&pageSize=${size}`,
        authToken: localStorage.getItem("authToken"),
      })
      setProductError(err.response?.data?.message || "Failed to load orders. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }

  const fetchProductList = async () => {
    try {
      setProductLoading(true)
      setProductError(null)
      const aggregated: AddProduct[] = []
      let page = 1
      const size = 150
      let totalPagesLocal = 1
      do {
        const response = await axiosInstance.get(`/api/v1/product/all?page=${page}&pageSize=${size}`, {
          headers: { accept: "*/*" },
        })
        console.log("Fetch Product List Page Response:", {
          status: response.status,
          page,
          dataCount: (response.data.data || response.data.output || []).length,
          totalPages: response.data.totalPages,
          url: `/api/v1/product/all?page=${page}&pageSize=${size}`,
          authToken: localStorage.getItem("authToken"),
        })
        const pageData: AddProduct[] = response.data.data || response.data.output || []
        aggregated.push(...pageData)
        totalPagesLocal = response.data.totalPages || 1
        page += 1
      } while (page <= totalPagesLocal)
      const dedup = Array.from(new Map(aggregated.map(p => [p.id, p])).values())
      setProductList(dedup)
      console.log("Total products aggregated:", dedup.length)
    } catch (err: any) {
      console.error("Fetch Product List Error:", err)
      setProductError(err.response?.data?.message || "Failed to load products. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, pageSize)

    fetchProductList()
  }, [currentPage, pageSize])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "Low Stock" ? product.quantity > 0 && product.quantity < 20 : product.status === statusFilter)
    const matchesCategory = categoryFilter === "all" || productList.find(p => p.id === product.productId)?.categoryName === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (productError) return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <p className="text-red-500">Error loading orders: {productError}</p>
      <Button
        variant="outline"
        onClick={() => { fetchProducts(currentPage, pageSize); fetchProductList(); }}
        className="mt-4"
      >
        Retry
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track all your product orders and requests</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Place Order
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    placeholder="Search products..."
                  />
                </div>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <MarketHubCardList
          products={filteredProducts}
          productList={productList}
          isLoading={productLoading}
          onRefresh={() => fetchProducts(currentPage, pageSize)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Place Order</DialogTitle>
            </DialogHeader>
            <OrderForm
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              vendorId={vendorId}
              productList={productList}
              productLoading={productLoading}
              productError={productError}
              onRefresh={() => { fetchProducts(currentPage, pageSize); fetchProductList(); }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}