"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import ProductTable from "./FarmerProductTable"
import ProductFormDialog from "./FarmerProductFormDialog"
import { FarmerProductProps, AddProduct, FarmerProductFormProps } from "../../type"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export default function ProductDashboard() {
  const [products, setProducts] = useState<FarmerProductProps[]>([])
  const [productList, setProductList] = useState<AddProduct[]>([])
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  // Retrieve userId from localStorage
  const farmerId = localStorage.getItem("userId")

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Available", label: "Available" },
    { value: "Hidden", label: "Hidden" },
  ]

  // Fetch products with pagination
  const fetchProducts = async (page: number = 1, size: number = 20) => {
    if (!farmerId) {
      setProductError("User not logged in. Please log in to view products.")
      router.push("/login")
      return
    }

    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get(`/api/v1/farmer-product/get-all?farmerId=${farmerId}&page=${page}&pageSize=${size}`, {
        headers: { accept: "*/*" },
      })
      setProducts(response.data.data || [])
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || 1)
      setPageSize(response.data.pageSize || 20)
    } catch (err: any) {
      console.error("Fetch Products Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      })
      setProductError(err.response?.data?.message || "Failed to load products. Please try again.")
      toast.error(err.response?.data?.message || "Failed to load products")
    } finally {
      setProductLoading(false)
    }
  }

  // Fetch ALL products (the /api/v1/product/all endpoint is paginated, so we iterate pages)
  const fetchAllProducts = async (pageSize: number = 100) => {
    try {
      const all: AddProduct[] = []
      let page = 1
      let totalPagesLocal = 1
      do {
        const response = await axiosInstance.get(`/api/v1/product/all?page=${page}&pageSize=${pageSize}`, {
          headers: { accept: "*/*" },
        })
        const pageData: AddProduct[] = response.data.data || response.data.output || []
        all.push(...pageData)
        totalPagesLocal = response.data.totalPages || 1
        page += 1
      } while (page <= totalPagesLocal)
      // Remove duplicate ids just in case (defensive)
      const dedup = Array.from(new Map(all.map(p => [p.id, p])).values())
      setProductList(dedup)
    } catch (err: any) {
      console.error("Fetch All Products Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
      toast.error(err.response?.data?.message || "Failed to load full product list")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/category/all", {
        headers: { accept: "*/*" },
      })
      const categoryData = response.data.data || []
      const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...categoryData.map((cat: { id: string; name: string }) => ({
          value: cat.name,
          label: cat.name,
        })),
      ]
      setCategories(categoryOptions)
    } catch (err: any) {
      console.error("Fetch Categories Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      })
      setCategoryError(err.response?.data?.message || "Failed to load categories. Please try again.")
      toast.error(err.response?.data?.message || "Failed to load categories")
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, pageSize)
    // Only need to load all products once (do not depend on pagination of farmer products list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchAllProducts(200) // attempt larger page size per request to reduce round trips
    fetchCategories()
  }, [currentPage, pageSize])

  const handleSave = async (formData: Partial<FarmerProductFormProps>) => {
    if (!farmerId) {
      throw new Error("User not logged in. Please log in to add products.")
    }

    const payload = {
      farmerId: farmerId,
      productId: formData.productId!,
      quantity: formData.quantity!,
      pricePerUnit: formData.pricePerUnit!,
      availableFrom: new Date(formData.availableFrom!).toISOString(),
      description: formData.description || "",
    }

    try {
      await axiosInstance.post("/api/v1/farmer-product/create", payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      await fetchProducts(currentPage, pageSize)
      toast.success("Product added successfully")
    } catch (err: any) {
      console.error("Save Product Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
        payload: JSON.stringify(payload),
      })
      throw new Error(err.response?.data?.message || "Failed to save product")
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Available" && product.status === "Available") ||
      (statusFilter === "Hidden" && product.status === "Hidden")
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (productError || categoryError) return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      {productError && <p className="text-red-500">Error: {productError}</p>}
      {categoryError && <p className="text-red-500">Error: {categoryError}</p>}
      <Button
        variant="outline"
        onClick={() => {
          fetchProducts(currentPage, pageSize)
          fetchCategories()
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
            <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Product
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
                    placeholder="Product name..."
                  />
                </div>
              </div>
              
              
            </div>
          </CardContent>
        </Card>

        <ProductTable
          products={filteredProducts}
          isLoading={productLoading}
          onRefresh={() => fetchProducts(currentPage, pageSize)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <ProductFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          farmerId={farmerId || ""}
          productList={productList}
        />
      </div>
    </div>
  )
}