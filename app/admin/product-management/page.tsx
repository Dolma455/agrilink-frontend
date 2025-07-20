"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"

interface Product {
  id: string
  name: string
  category: string
  image: string
}

const categoryOptions = [
  { value: "Vegetables", label: "Vegetables" },
  { value: "Fruits", label: "Fruits" },
  { value: "Grains", label: "Grains" },
  { value: "Dairy", label: "Dairy" },
  { value: "Hardware", label: "Hardware" },
  { value: "Stationery", label: "Stationery" },
]

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD001", name: "Tomatoes", category: "Vegetables", image: "/assets/images/tomatoes.jpg" },
    { id: "PRD002", name: "Potatoes", category: "Dairy", image: "/assets/images/potatoes.jpg" },
    { id: "PRD003", name: "Rice", category: "Hardware", image: "/assets/images/rice.jpg" },
    { id: "PRD004", name: "Apples", category: "Fruits", image: "/assets/images/apples.jpg" },
    { id: "PRD005", name: "Mangoes", category: "Stationery", image: "/assets/images/mangoes.jpg" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({ name: "", category: "", image: "" })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Filtered products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Handle form field changes
  function handleFormChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error on input change
  }

  // Handle image upload
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        setImageUrl("") // Clear image URL if file used
        handleFormChange("image", reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  // Handle image URL change
  function handleImageUrlChange(url: string) {
    setImageUrl(url)
    setImagePreview(url)
    setImageFile(null) // Clear file if URL used
    handleFormChange("image", url)
  }

  // Remove image
  function removeImage() {
    setImagePreview(null)
    setImageUrl("")
    setImageFile(null)
    handleFormChange("image", "")
  }

  // Handle Delete action
  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
      if (editingProduct?.id === id) {
        setIsDialogOpen(false)
        setEditingProduct(null)
      }
    }
  }

  // Handle Edit action
  function handleEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
    })
    setImagePreview(product.image)
    setImageUrl(product.image)
    setImageFile(null)
    setIsDialogOpen(true)
  }

  // Handle Add new product
  function handleAddNew() {
    setEditingProduct(null)
    setFormData({ name: "", category: "", image: "" })
    setImagePreview(null)
    setImageUrl("")
    setImageFile(null)
    setIsDialogOpen(true)
  }

  // Handle Save (add or update)
  function handleSave(e: React.FormEvent) {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.category.trim() || !formData.image.trim()) {
      setError("Please fill in all fields including image.")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const finalProduct: Product = {
        ...formData,
        id: editingProduct ? editingProduct.id : `PRD${Math.floor(1000 + Math.random() * 9000)}`,
      }

      if (editingProduct) {
        // Update existing product
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? finalProduct : p)))
        alert("Product updated successfully!")
      } else {
        // Add new product
        setProducts((prev) => [...prev, finalProduct])
        alert("Product added successfully!")
      }

      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingProduct(null)
      setFormData({ name: "", category: "", image: "" })
      setImagePreview(null)
      setImageUrl("")
      setImageFile(null)
      setError("")
    }, 1500)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Admin view: Manage product name, category, and image</p>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                      placeholder="Search product..."
                    />
                  </div>
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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

          {/* Product Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Products ({filteredProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    )}
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
                {/* Product Name */}
                <div className="space-y-2">
                  <Label>Product Name *</Label>
                  <Input
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload or URL */}
                <div className="space-y-2">
                  <Label>Image (Upload or URL) *</Label>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="imageUpload"
                      className="flex items-center justify-center border border-dashed border-gray-400 rounded-md p-2 cursor-pointer hover:bg-gray-100"
                    >
                      <ImagePlus className="h-5 w-5 mr-2" />
                      Choose Image
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Or paste image URL"
                    value={imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                  {imagePreview && (
                    <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-md border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input
                    placeholder="Enter category"
                    value={formData.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    required
                  />
                  <Select
                    onValueChange={(val) => handleFormChange("category", val)}
                    value={categoryOptions.some(opt => opt.value === formData.category) ? formData.category : ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Or select category" />
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

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <DialogFooter>
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