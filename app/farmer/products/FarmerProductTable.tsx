import { FarmerProductProps } from "../../type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PackageCheck, RefreshCw, Loader2 } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

interface ProductTableProps {
  products: FarmerProductProps[]
  isLoading: boolean
  onRefresh: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProductTable({ products, isLoading, onRefresh, currentPage, totalPages, onPageChange }: ProductTableProps) {
  const [restockId, setRestockId] = useState<string | null>(null)
  const [restockData, setRestockData] = useState<{
    quantity: string;
    pricePerUnit: string;
    availableFrom: string;
  }>({ quantity: "", pricePerUnit: "", availableFrom: new Date().toISOString().split('T')[0] })
  const [restockError, setRestockError] = useState<string>("")
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    if (status === "Available") {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
          <PackageCheck className="h-3 w-3" />
          Available
        </Badge>
      )
    }
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        Hidden
      </Badge>
    )
  }

  const handleRestock = async () => {
    const { quantity, pricePerUnit, availableFrom } = restockData
    if (!restockId || !quantity || parseFloat(quantity) <= 0) {
      setRestockError("Please enter a valid quantity greater than 0.")
      return
    }
    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      setRestockError("Please enter a valid price per unit greater than 0.")
      return
    }
    if (!availableFrom) {
      setRestockError("Please select an available from date.")
      return
    }

    setIsLoadingAction(`restock-${restockId}`)
    try {
      const payload = {
        quantity: parseFloat(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
        availableFrom: new Date(availableFrom).toISOString(),
      }
      const response = await axiosInstance.patch(`/api/v1/farmer-product/restock/${restockId}`, payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log("Restock Response:", {
        status: response.status,
        data: response.data,
        payload,
        url: `/api/v1/farmer-product/restock/${restockId}`,
        productId: restockId,
      })
      toast.success(response.data.message || "Product restocked successfully")
      setRestockId(null)
      setRestockData({ quantity: "", pricePerUnit: "", availableFrom: new Date().toISOString().split('T')[0] })
      setRestockError("")
      onRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to restock product. Please check product ID, authentication, or input values."
      console.error("Restock Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `/api/v1/farmer-product/restock/${restockId}`,
        payload: { quantity, pricePerUnit, availableFrom },
        productId: restockId,
      })
      setRestockError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingAction(null)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setIsLoadingAction(`toggle-${id}`)
    try {
      const newStatus = currentStatus === "Available" ? "Hidden" : "Available"
      const payload = { status: newStatus }
      const response = await axiosInstance.patch(`/api/v1/farmer-product/update-status/${id}`, payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log("Toggle Status Response:", {
        status: response.status,
        data: response.data,
        payload,
        url: `/api/v1/farmer-product/update-status/${id}`,
        productId: id,
      })
      toast.success(response.data.message || `Product status updated to ${newStatus}`)
      onRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update product status."
      console.error("Toggle Status Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `/api/v1/farmer-product/update-status/${id}`,
        payload: { status: currentStatus === "Available" ? "Hidden" : "Available" },
        productId: id,
      })
      toast.error(errorMessage)
    } finally {
      setIsLoadingAction(null)
    }
  }

  if (isLoading) return <p>Loading products...</p>

  if (!products.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Products (0)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No products found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trending</TableHead>
                  <TableHead>Available From</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity} {product.unit}</TableCell>
                    <TableCell>Rs. {product.pricePerUnit}/{product.unit}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      {product.isTrending ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          Trending
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(product.availableFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => setRestockId(product.id)}
                                disabled={isLoadingAction === `restock-${product.id}`}
                              >
                                {isLoadingAction === `restock-${product.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Restock</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={product.status === "Available"}
                                  onCheckedChange={() => handleToggleStatus(product.id, product.status)}
                                  disabled={isLoadingAction === `toggle-${product.id}`}
                                  className={product.status === "Available" ? "data-[state=checked]:bg-green-600" : ""}
                                />
                                <span className="text-sm">
                                  {isLoadingAction === `toggle-${product.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    product.status
                                  )}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Toggle Available/Hidden</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              variant="outline"
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!restockId} onOpenChange={() => {
        setRestockId(null)
        setRestockData({ quantity: "", pricePerUnit: "", availableFrom: new Date().toISOString().split('T')[0] })
        setRestockError("")
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Restock Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Quantity to Add *</Label>
              <Input
                type="number"
                value={restockData.quantity}
                onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })}
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Price per Unit (Rs.) *</Label>
              <Input
                type="number"
                value={restockData.pricePerUnit}
                onChange={(e) => setRestockData({ ...restockData, pricePerUnit: e.target.value })}
                placeholder="Enter price"
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Available From *</Label>
              <Input
                type="date"
                value={restockData.availableFrom}
                onChange={(e) => setRestockData({ ...restockData, availableFrom: e.target.value })}
                required
              />
            </div>
            {restockError && <p className="text-red-500 text-sm">{restockError}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRestockId(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestock}
                disabled={isLoadingAction !== null}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoadingAction ? <Loader2 className="h-4 w-4 animate-spin" /> : "Restock"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}