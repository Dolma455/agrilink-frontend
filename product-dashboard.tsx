import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Edit, Filter, Package, PackageCheck, PackageX, Plus, RefreshCw, Search, Trash2, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export default function ProductDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const products = [
    { id: "PRD001", name: "Tomatoes", category: "Vegetables", quantity: 80, unit: "kg", price: 30, status: "available", trending: true, lastUpdated: "2024-01-15" },
    { id: "PRD002", name: "Milk", category: "Dairy", quantity: 100, unit: "ltr", price: 70, status: "available", trending: true, lastUpdated: "2024-01-14" },
    { id: "PRD003", name: "Steel Rod", category: "Hardware", quantity: 30, unit: "m", price: 450, status: "available", trending: false, lastUpdated: "2024-01-13" },
    { id: "PRD004", name: "Apples", category: "Fruits", quantity: 0, unit: "kg", price: 80, status: "sold-out", trending: false, lastUpdated: "2024-01-12" },
    { id: "PRD005", name: "Notebook", category: "Stationery", quantity: 10, unit: "pcs", price: 25, status: "available", trending: true, lastUpdated: "2024-01-11" },
  ]

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

  return (
    <TooltipProvider>
      <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Product Dashboard</h1>
              <p className="text-muted-foreground">Manage your product inventory and pricing</p>
            </div>
            <Button asChild className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white" >
              <Link href="/farmer/products/add">
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters & Search</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" placeholder="Product name..." />
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
                  <Button variant="outline" className="w-full" onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setCategoryFilter("all")
                  }}>Clear Filters</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Table */}
          <Card>
            <CardHeader><CardTitle>Products ({filteredProducts.length})</CardTitle></CardHeader>
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
                                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>

                            {product.quantity === 0 ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon"><RefreshCw className="h-4 w-4 text-blue-600" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>Restock</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon"><PackageX className="h-4 w-4 text-red-600" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Sold Out</TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
        </div>
      </div>
    </TooltipProvider>
  )
}
