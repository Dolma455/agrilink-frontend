
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Search } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import MarketHubFarmerCardList from "./MarketHubFarmerCardList"

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

interface AddProduct {
  id: string
  name: string
  categoryName: string
  imageUrl?: string
}

export default function MarketHubFarmer() {
  const [products, setProducts] = useState<MarketHubProduct[]>([])
  const [productList, setProductList] = useState<AddProduct[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  const farmerId = localStorage.getItem("userId")

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Fruits", label: "Fruits" },
    { value: "Grains", label: "Grains" },
    { value: "Dairy", label: "Dairy" },
    { value: "Hardware", label: "Hardware" },
    { value: "Stationery", label: "Stationery" },
  ]

  const fetchProducts = async () => {
    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get(`/api/v1/marketHub/farmer?farmerId=${farmerId}`, {
        headers: { accept: "*/*" },
      })
      console.log("Fetch MarketHub Farmer Products Response:", {
        status: response.status,
        data: response.data,
        url: `/api/v1/marketHub/farmer?farmerId=${farmerId}`,
        authToken: localStorage.getItem("authToken"),
      })
      setProducts(response.data.data || [])
    } catch (err: any) {
      console.error("Fetch MarketHub Farmer Products Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `/api/v1/marketHub/farmer?farmerId=${farmerId}`,
        authToken: localStorage.getItem("authToken"),
      })
      setProductError(err.response?.data?.message || "Failed to load vendor orders. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }

  const fetchProductList = async () => {
    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get("/api/v1/product/all", {
        headers: { accept: "*/*" },
      })
      console.log("Fetch Product List Response:", {
        status: response.status,
        data: response.data,
        url: "/api/v1/product/all",
        authToken: localStorage.getItem("authToken"),
      })
      setProductList(response.data.data || [])
      console.log("productList after fetch:", response.data.data || [])
    } catch (err: any) {
      console.error("Fetch Product List Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: "/api/v1/product/all",
        authToken: localStorage.getItem("authToken"),
      })
      setProductError(err.response?.data?.message || "Failed to load products. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchProductList()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || productList.find(p => p.id === product.productId)?.categoryName === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (productError) return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <p className="text-red-500">Error loading vendor orders: {productError}</p>
      <Button
        variant="outline"
        onClick={() => { fetchProducts(); fetchProductList(); }}
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
            <h1 className="text-3xl font-bold tracking-tight">Vendor Orders</h1>
            <p className="text-muted-foreground">Browse vendor order requests and submit your proposals</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <MarketHubFarmerCardList
          products={filteredProducts}
          productList={productList}
          isLoading={productLoading}
          onRefresh={fetchProducts}
        />
      </div>
    </div>
  )
}
