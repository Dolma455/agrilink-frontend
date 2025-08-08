"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import ProductTable from "./FarmerProductTable"
import ProductFormDialog from "./FarmerProductFormDialog"
import { FarmerProductProps, AddProduct, FarmerProductFormProps } from "../../type"
import { useRouter } from "next/navigation"

export default function ProductDashboard() {
  const [products, setProducts] = useState<FarmerProductProps[]>([])
  const [productList, setProductList] = useState<AddProduct[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  // Retrieve userId from localStorage
  const farmerId = localStorage.getItem("userId")

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Available", label: "Available" },
    { value: "Sold Out", label: "Sold Out" },
    { value: "low-stock", label: "Low Stock" },
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

  const fetchProducts = async () => {
    if (!farmerId) {
      setProductError("User not logged in. Please log in to view products.")
      router.push("/login")
      return
    }

    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get(`/api/v1/farmer-product/get-all?farmerId=${farmerId}`, {
        headers: { accept: "*/*" },
      })
      setProducts(response.data.data || [])
    } catch (err: any) {
      console.error("Fetch Products Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      })
      setProductError(err.response?.data?.message || "Failed to load products. Please try again.")
    } finally {
      setProductLoading(false)
    }
  }

  const fetchProductList = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/product/all", {
        headers: { accept: "*/*" },
      })
      setProductList(response.data.data || [])
    } catch (err: any) {
      console.error("Fetch Product List Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      })
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchProductList()
  }, [])

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
      await fetchProducts()
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true
    if (statusFilter === "Available") matchesStatus = product.quantity > 0
    else if (statusFilter === "Sold Out") matchesStatus = product.quantity === 0
    else if (statusFilter === "low-stock") matchesStatus = product.quantity > 0 && product.quantity < 20
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (productError) return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <p className="text-red-500">Error: {productError}</p>
      <Button
        variant="outline"
        onClick={fetchProducts}
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

        <ProductTable
          products={filteredProducts}
          isLoading={productLoading}
          onRefresh={fetchProducts}
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