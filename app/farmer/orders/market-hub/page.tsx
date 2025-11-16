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
  // paginated products (backend pages)
  const [products, setProducts] = useState<MarketHubProduct[]>([])
  // full list fetched by iterating backend pages (used for global search)
  const [allProducts, setAllProducts] = useState<MarketHubProduct[]>([])
  const [productList, setProductList] = useState<AddProduct[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // farmerId from localStorage (same key you used elsewhere)
  const farmerId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const fetchProductsPage = async (page: number = 1, size: number = 10) => {
    if (!farmerId) {
      setProductError("User not logged in. Please log in to view orders.")
      return
    }
    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get(
        `/api/v1/marketHub/farmer?farmerId=${farmerId}&page=${page}&pageSize=${size}`,
        { headers: { accept: "*/*" } }
      )
      const data = response.data.data || []
      setProducts(data)
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || page)
      setPageSize(response.data.pageSize || size)
    } catch (err: any) {
      console.error("Fetch MarketHub Farmer Products Error (page):", err)
      setProductError(err?.response?.data?.message || "Failed to load vendor orders. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }
  const fetchAllProducts = async (pageSizeFetch: number = 100) => {
    if (!farmerId) {
      // no farmer logged in — nothing to do
      return
    }
    try {
      setProductLoading(true)
      setProductError(null)

      const all: MarketHubProduct[] = []
      let page = 1
      let totalPagesLocal = 1

      // Loop until we've retrieved all pages
      do {
        const resp = await axiosInstance.get(
          `/api/v1/marketHub/farmer?farmerId=${farmerId}&page=${page}&pageSize=${pageSizeFetch}`,
          { headers: { accept: "*/*" } }
        )

        const pageData: MarketHubProduct[] = resp.data.data || []
        all.push(...pageData)

        // some APIs return totalPages, some don't. handle both.
        totalPagesLocal = resp.data.totalPages || (pageData.length < pageSizeFetch ? page : page + 1)
        page += 1

        // defensive break if nothing returned
        if (pageData.length === 0) break
      } while (page <= totalPagesLocal)

      // dedupe by id (defensive)
      const dedup = Array.from(new Map(all.map((p) => [p.id, p])).values())
      setAllProducts(dedup)

      // update totalPages for UI pagination based on full list
      setTotalPages(Math.max(1, Math.ceil(dedup.length / pageSize)))
    } catch (err: any) {
      console.error("Fetch All MarketHub Error:", err)
      // don't block UI browsing — show error but allow fallback paginated fetch
      setProductError(err?.response?.data?.message || "Failed to load market hub items for search.")
    } finally {
      setProductLoading(false)
    }
  }

  const fetchProductList = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/product/all", { headers: { accept: "*/*" } })
      setProductList(response.data.data || [])
    } catch (err: any) {
      console.error("Fetch Product List Error:", err)
    }
  }

  useEffect(() => {
    // fetch first page for normal browsing
    fetchProductsPage(currentPage, pageSize)
    fetchAllProducts(200) 
    fetchProductList()
  }, [])

  useEffect(() => {
    // If there's no active search, fetch the specific page from backend
    if (searchTerm.trim() === "") {
      fetchProductsPage(currentPage, pageSize)
    }
  }, [currentPage, pageSize])

  const source = searchTerm.trim() !== "" ? allProducts : products

  const filteredProducts = source.filter((product) => {
    // SEARCH match
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      q === "" ||
      (product.productName && product.productName.toLowerCase().includes(q)) ||
      (product.location && product.location.toLowerCase().includes(q))

    // CATEGORY match: try to use productList mapping; fallback to product.category if present
    const prodMeta = productList.find((p) => p.id === product.productId)
    const productCategory = prodMeta?.categoryName || (product as any).category || "Unknown"

    const matchesCategory = categoryFilter === "all" || productCategory === categoryFilter

    return matchesSearch && matchesCategory
  })

  // If search is active, paginate the filteredProducts client-side
  const paginatedFilteredProducts = (() => {
    if (searchTerm.trim() === "") {
      return filteredProducts // already paginated by backend
    }
    const start = (currentPage - 1) * pageSize
    return filteredProducts.slice(start, start + pageSize)
  })()

  // total pages calculation: when searching -> from filtered length, else from backend totalPages
  const totalFilteredPages = searchTerm.trim() === "" ? totalPages : Math.max(1, Math.ceil(filteredProducts.length / pageSize))

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFilteredPages) {
      setCurrentPage(newPage)
    }
  }

  if (productError)
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <p className="text-red-500">Error loading vendor orders: {productError}</p>
        <Button
          variant="outline"
          onClick={() => {
            // retry both flows
            fetchProductsPage(1, pageSize)
            fetchAllProducts(200)
            fetchProductList()
          }}
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // reset page so user sees page 1 of results
                    }}
                    className="pl-8"
                    placeholder="Search products or location..."
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                    setCurrentPage(1)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <MarketHubFarmerCardList
          products={paginatedFilteredProducts}
          productList={productList}
          isLoading={productLoading}
          onRefresh={() => {
            fetchProductsPage(currentPage, pageSize)
            fetchAllProducts(200)
          }}
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
