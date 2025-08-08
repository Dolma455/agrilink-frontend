"use client"

import { useEffect, useState } from "react"
import ProductTable from "./ProductTable"
import ProductFormDialog from "./ProductFormDialog"
import { Button } from "@/components/ui/button"
import { ProductProps, ProductFormProps, CategoryProps, UnitProps } from "../../type"
import axiosInstance from "@/lib/axiosInstance"
import { Plus, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductProps | null>(null)
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [units, setUnits] = useState<UnitProps[]>([])
  const currentUserId = localStorage.getItem("userId") ?? ""

  // Fetch products
  const fetchProducts = async () => {
    try {
      setProductLoading(true)
      setProductError(null)
      const response = await axiosInstance.get("/api/v1/product/all")
      setProducts(response.data.data || response.data.output || [])
    } catch (err: any) {
      console.error("Fetch Products Error:", err)
      setProductError(err.message || "Failed to load products")
    } finally {
      setProductLoading(false)
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
    fetchProducts()
    fetchCategories()
    fetchUnits()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  function handleAddNew() {
    setEditingProduct(null)
    setIsDialogOpen(true)
  }

  // Save product handler
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
      const response = await axiosInstance.post("/api/v1/product/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Product saved successfully:", response.data)
      await fetchProducts()
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Save product Error:", err)
      throw new Error(err.response?.data?.message || "Failed to save product")
    }
  }

  if (productLoading) return <p>Loading products...</p>
  if (productError) return <p>Error loading products: {productError}</p>

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
            <p className="text-muted-foreground">Admin view: Manage products</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="relative max-w-sm pt-4">
              <Search className="absolute left-3 top-7 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or symbol..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <ProductTable
          products={filteredProducts}
          isLoading={productLoading}
          onEdit={(product) => {
            setEditingProduct(product)
            setIsDialogOpen(true)
          }}
        />

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