"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Edit, Filter, Package, PackageCheck, PackageX, Plus, RefreshCw, Search, Trash2, TrendingUp, ImagePlus, X, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Product {
  id: string
  name: string
  image?: string
  category: string
  description?: string
  quantity: number
  unit: string
  price: number
  status: "available" | "sold-out"
  trending: boolean
  lastUpdated: string
}

interface SimpleProduct {
  id: string
  name: string
  image?: string
  category: string
}

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD001", name: "Tomatoes", category: "Vegetables", quantity: 80, unit: "kg", price: 30, status: "available", trending: true, lastUpdated: "2024-01-15" },
    { id: "PRD002", name: "Milk", category: "Dairy", quantity: 100, unit: "ltr", price: 70, status: "available", trending: true, lastUpdated: "2024-01-14" },
    { id: "PRD003", name: "Steel Rod", category: "Hardware", quantity: 30, unit: "m", price: 450, status: "available", trending: false, lastUpdated: "2024-01-13" },
    { id: "PRD004", name: "Apples", category: "Fruits", quantity: 0, unit: "kg", price: 80, status: "sold-out", trending: false, lastUpdated: "2024-01-12" },
    { id: "PRD005", name: "Notebook", category: "Stationery", quantity: 10, unit: "pcs", price: 25, status: "available", trending: true, lastUpdated: "2024-01-11" },
  ])

  const [productList] = useState<SimpleProduct[]>([
    { id: "1", name: "Tomato", image: "/assets/images/tomatoes.jpg", category: "Vegetables" },
    { id: "2", name: "Apple", image: "/assets/images/apples.jpg", category: "Fruits" },
    { id: "3", name: "Spinach", image: "/assets/images/spinach.jpg", category: "Grains" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    category: "",
    description: "",
    quantity: 0,
    unit: "kg",
    price: 0,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "low-stock", label: "Low Stock" },
    { value: "sold-out", label: "Sold Out" },
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

  const unitOptions = ["kg", "liter", "piece", "dozen", "quintal", "ton", "meter"]

  const getStatusBadge = (status: string, quantity: number) => {
    if (status === "sold-out" || quantity === 0) {
      return <Badge variant="destructive" className="flex items-center gap-1"><PackageX className="h-3 w-3" />Sold Out</Badge>
    } else if (quantity < 20) {
      return <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800"><AlertTriangle className="h-3 w-3" />Low Stock</Badge>
    } else {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800"><PackageCheck className="h-3 w-3" />Available</Badge>
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    let matchesStatus = true
    if (statusFilter === "available") matchesStatus = product.quantity > 0
    else if (statusFilter === "sold-out") matchesStatus = product.quantity === 0
    else if (statusFilter === "low-stock") matchesStatus = product.quantity > 0 && product.quantity < 20
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
      if (editingProduct?.id === id) {
        setIsDialogOpen(false)
        setEditingProduct(null)
      }
    }
  }

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      image: product.image || "",
      category: product.category,
      description: product.description || "",
      quantity: product.quantity,
      unit: product.unit,
      price: product.price,
    })
    setImagePreview(product.image || null)
    setIsDialogOpen(true)
  }

  function handleAddNew() {
    setEditingProduct(null)
    setFormData({
      name: "",
      image: "",
      category: "",
      description: "",
      quantity: 0,
      unit: "kg",
      price: 0,
    })
    setImagePreview(null)
    setIsDialogOpen(true)
  }

  function handleMarkSoldOut(id: string) {
    setProducts(products.map((p) =>
      p.id === id ? { ...p, quantity: 0, status: "sold-out", lastUpdated: new Date().toISOString().split('T')[0] } : p
    ))
  }

  function handleRestock(id: string) {
    const quantity = prompt("Enter restock quantity:")
    const parsedQuantity = parseFloat(quantity || "0")
    if (parsedQuantity > 0) {
      setProducts(products.map((p) =>
        p.id === id ? { ...p, quantity: parsedQuantity, status: "available", lastUpdated: new Date().toISOString().split('T')[0] } : p
      ))
    }
  }

  function handleChange(field: keyof typeof formData, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        handleChange("image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setImagePreview(null)
    handleChange("image", "")
  }

  function handleMarkSoldOutInDialog() {
    if (!editingProduct) return
    setFormData((prev) => ({ ...prev, quantity: 0 }))
    setProducts(products.map((p) =>
      p.id === editingProduct.id ? { ...p, quantity: 0, status: "sold-out", lastUpdated: new Date().toISOString().split('T')[0] } : p
    ))
    setIsDialogOpen(false)
    alert("Product marked as sold out")
  }

  function handleRestockInDialog() {
    if (!editingProduct) return
    const quantity = prompt("Enter restock quantity:")
    const parsedQuantity = parseFloat(quantity || "0")
    if (parsedQuantity > 0) {
      setFormData((prev) => ({ ...prev, quantity: parsedQuantity }))
      setProducts(products.map((p) =>
        p.id === editingProduct.id ? { ...p, quantity: parsedQuantity, status: "available", lastUpdated: new Date().toISOString().split('T')[0] } : p
      ))
      setIsDialogOpen(false)
      alert("Product restocked successfully")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.unit.trim() ||
      formData.quantity < 0 ||
      formData.price <= 0
    ) {
      setError("Please fill in all required fields with valid values")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newProduct: Product = {
        id: editingProduct ? editingProduct.id : `PRD${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        image: formData.image,
        category: formData.category,
        description: formData.description,
        quantity: formData.quantity,
        unit: formData.unit,
        price: formData.price,
        status: formData.quantity > 0 ? "available" : "sold-out",
        trending: editingProduct ? editingProduct.trending : false,
        lastUpdated: new Date().toISOString().split('T')[0],
      }

      if (editingProduct) {
        // Update existing product
        setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)))
        alert("Product updated successfully")
      } else {
        // Add new product
        setProducts([...products, newProduct])
        alert("Product added successfully")
      }

      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingProduct(null)
      setFormData({
        name: "",
        image: "",
        category: "",
        description: "",
        quantity: 0,
        unit: "kg",
        price: 0,
      })
      setImagePreview(null)
      setError("")
    }, 1500)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
              <p className="text-muted-foreground">Manage your product inventory and pricing</p>
            </div>
            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Filters */}
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
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                      placeholder="Product name..."
                    />
                  </div>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
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

          {/* Product Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Qty Available</TableHead>
                      <TableHead>Price/unit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Trending</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.quantity} {product.unit}</TableCell>
                        <TableCell>Rs. {product.price}/{product.unit}</TableCell>
                        <TableCell>{getStatusBadge(product.status, product.quantity)}</TableCell>
                        <TableCell>
                          {product.trending ? (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <TrendingUp className="h-3 w-3 mr-1" />Trending
                            </Badge>
                          ) : <span className="text-muted-foreground text-sm">-</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{product.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            {product.quantity === 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleRestock(product.id)}>
                                    <RefreshCw className="h-4 w-4 text-blue-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Restock</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleMarkSoldOut(product.id)}>
                                    <PackageX className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Sold Out</TooltipContent>
                              </Tooltip>
                            )}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Add/Edit Product Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4">
                {/* Product Dropdown */}
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select
                    onValueChange={(selectedId) => {
                      const selected = productList.find((p) => p.id === selectedId)
                      if (selected) {
                        handleChange("name", selected.name)
                        handleChange("category", selected.category)
                        handleChange("image", selected.image || "")
                        setImagePreview(selected.image || null)
                      }
                    }}
                    disabled={!!editingProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productList.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload and Preview */}
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImagePlus className="h-4 w-4" />
                      Upload Image
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input value={formData.category} readOnly />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Add product description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </div>

                {/* Quantity & Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleChange("quantity", parseFloat(e.target.value))}
                      placeholder="e.g. 10"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit *</Label>
                    <Select value={formData.unit} onValueChange={(val) => handleChange("unit", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label>Price per unit (Rs.) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                    placeholder="e.g. 50"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <DialogFooter className="flex justify-between">
                  {editingProduct && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleMarkSoldOutInDialog}
                        disabled={isLoading || formData.quantity === 0}
                      >
                        Mark as Sold Out
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRestockInDialog}
                        disabled={isLoading}
                      >
                        Restock
                      </Button>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingProduct ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      editingProduct ? "Update Product" : "Add Product"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  )
}