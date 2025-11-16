"use client"

import { useEffect, useState } from "react"
import ProductTable from "./ProductTable"
import ProductFormDialog from "./ProductFormDialog"
import { Button } from "@/components/ui/button"
import { ProductProps, ProductFormProps, CategoryProps, UnitProps } from "../../type"
import axiosInstance from "@/lib/axiosInstance"
import { Plus, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [allProducts, setAllProducts] = useState<ProductProps[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null)

  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [units, setUnits] = useState<UnitProps[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const currentUserId = localStorage.getItem("userId") ?? ""

  // Fetch products (paginated)
  const fetchProducts = async (page: number = 1, size: number = 10) => {
    try {
      setProductLoading(true)
      setProductError(null)

      const response = await axiosInstance.get(
        `/api/v1/product/all?page=${page}&pageSize=${size}`
      )

      setProducts(response.data.data || response.data.output || [])
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || 1)
      setPageSize(response.data.pageSize || 10)
    } catch (err: any) {
      console.error("Fetch Products Error:", err)
      setProductError("Failed to load products")
    } finally {
      setProductLoading(false)
    }
  }

  // Fetch ALL products (for global search)
  const fetchAllProducts = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/product/all?page=1&pageSize=500`)
      setAllProducts(response.data.data || response.data.output || [])
    } catch (err) {
      console.error("Fetch All Products Error:", err)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/category/all")
      setCategories(response.data.output || response.data.data || [])
    } catch (err) {
      console.error("Fetch Categories Error:", err)
    }
  }

  // Fetch units
  const fetchUnits = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/unit/all")
      setUnits(response.data.output || response.data.data || [])
    } catch (err) {
      console.error("Fetch Units Error:", err)
    }
  }

  useEffect(() => {
    fetchProducts(currentPage, pageSize)
    fetchAllProducts()
    fetchCategories()
    fetchUnits()
  }, [currentPage, pageSize])

  // -----------------------------------
  // GLOBAL SEARCH & CATEGORY FILTER
  // -----------------------------------
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesCategory =
      categoryFilter === "all" ||
      product.categoryName?.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // PAGINATE FILTERED PRODUCTS
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const totalFilteredPages = Math.ceil(filteredProducts.length / pageSize)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFilteredPages) {
      setCurrentPage(newPage)
    }
  }

  function handleAddNew() {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  // SAVE PRODUCT
  async function handleSave(formData: Partial<ProductFormProps> & { imageFile?: File | null }) {
    const payload = new FormData()
    payload.append("Name", formData.name!)
    payload.append("Description", formData.description || "")
    payload.append("CategoryId", formData.categoryId || "")
    payload.append("UnitId", formData.unitId || "")
    payload.append("CreatedBy", currentUserId ?? "")

    if (formData.imageFile) {
      payload.append("Image", formData.imageFile)
    }

    try {
      await axiosInstance.post("/api/v1/product/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      await fetchProducts(currentPage, pageSize)
      await fetchAllProducts() // refresh global list

      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Save Product Error:", err)
      throw new Error(err.response?.data?.message || "Failed to save product")
    }
  }

  if (productLoading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">Admin view: Manage all products</p>
          </div>

          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* SEARCH + FILTER */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" /> Filters & Search
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search product name..."
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Table */}
        <ProductTable
          products={paginatedProducts}
          isLoading={productLoading}
          onEdit={(product) => {
            setEditingProduct(product)
            setIsDialogOpen(true)
          }}
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          onPageChange={handlePageChange}
        />

        {/* Dialog */}
        <ProductFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSave={handleSave}
          categories={categories}
          units={units}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  )
}
