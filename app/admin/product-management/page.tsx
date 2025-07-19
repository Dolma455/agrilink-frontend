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
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  // Products state for dynamic updates
  const [products, setProducts] = useState<Product[]>([
    { id: "PRD001", name: "Tomatoes", category: "Vegetables", image: "/assets/images/tomatoes.jpg" },
    { id: "PRD002", name: "Potatoes", category: "Dairy", image: "/assets/images/potatoes.jpg" },
    { id: "PRD003", name: "Rice", category: "Hardware", image: "/assets/images/rice.jpg" },
    { id: "PRD004", name: "Apples", category: "Fruits", image: "/assets/images/apples.jpg" },
    { id: "PRD005", name: "Mangoes", category: "Stationery", image: "/assets/images/mangoes.jpg" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Form state
  const [form, setForm] = useState<Product | null>(null)

  // Filtered products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Handle form field changes
  function handleFormChange(field: keyof Product, value: string) {
    if (!form) return
    setForm({ ...form, [field]: value })
  }

  // Handle Delete action
  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
      if (form?.id === id) {
        setForm(null) // Clear form if deleting the edited product
      }
    }
  }

  // Handle Edit action
  function handleEdit(product: Product) {
    setForm(product)
  }

  // Handle Add new product
  function handleAddNew() {
    setForm({ id: "", name: "", category: "", image: "" })
  }

  // Handle Save form (add or update)
  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return

    // Simple validation
    if (!form.name.trim() || !form.category.trim() || !form.image.trim()) {
      alert("Please fill all fields.")
      return
    }

    if (form.id) {
      // Update existing
      setProducts((prev) =>
        prev.map((p) => (p.id === form.id ? form : p))
      )
    } else {
      // Add new
      const newProduct = {
        ...form,
        id: `PRD${Math.floor(1000 + Math.random() * 9000)}`,
      }
      setProducts((prev) => [...prev, newProduct])
    }

    alert("Product saved successfully!")
    setForm(null)
  }

  // Handle Cancel form
  function handleCancel() {
    setForm(null)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Admin view: Product name, category, image, actions</p>
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

          {/* Editable Form */}
          {form && (
            <Card>
              <CardHeader>
                <CardTitle>{form.id ? "Edit Product" : "Add New Product"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Product Name</label>
                    <Input
                      value={form.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <Select
                      value={form.category}
                      onValueChange={(val) => handleFormChange("category", val)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

                  {/* Image preview and upload */}
                  <div>
                    <label className="block mb-1 font-medium">Current Image</label>
                    {form.image ? (
                      <img
                        src={form.image}
                        alt={form.name}
                        className="h-20 w-20 rounded object-cover mb-2 border"
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                    <p className="mb-2 text-sm text-gray-600">Upload new image to update</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () => {
                            handleFormChange("image", reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Save
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

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
        </div>
      </div>
    </TooltipProvider>
  )
}
