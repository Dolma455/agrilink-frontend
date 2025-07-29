
import { FarmerProductProps } from "../../type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PackageCheck, PackageX, AlertTriangle, RefreshCw, Check, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@radix-ui/react-label"

interface ProductTableProps {
  products: FarmerProductProps[]
  isLoading: boolean
  onRefresh: () => void
}

export default function ProductTable({ products, isLoading, onRefresh }: ProductTableProps) {
  const [restockId, setRestockId] = useState<string | null>(null)
  const [restockData, setRestockData] = useState<{
    quantity: string;
    pricePerUnit: string;
    availableFrom: string;
  }>({ quantity: "", pricePerUnit: "", availableFrom: new Date().toISOString().split('T')[0] })
  const [restockError, setRestockError] = useState<string>("")
  const [restockSuccess, setRestockSuccess] = useState<string>("")
  const [soldOutError, setSoldOutError] = useState<string>("")
  const [soldOutSuccess, setSoldOutSuccess] = useState<string>("")
  const [soldOutId, setSoldOutId] = useState<string | null>(null)
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null)

  const getStatusBadge = (status: string, quantity: number) => {
    if (status === "Sold Out" || quantity === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <PackageX className="h-3 w-3" />
          Sold Out
        </Badge>
      )
    } else if (quantity < 20) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800">
          <PackageCheck className="h-3 w-3" />
          Available
        </Badge>
      )
    }
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
      setRestockSuccess(response.data.message || "Product restocked successfully")
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
    } finally {
      setIsLoadingAction(null)
    }
  }

  const handleMarkSoldOut = async (id: string) => {
    setIsLoadingAction(`soldout-${id}`)
    setSoldOutId(id)
    try {
      const payload = { status: "Sold Out" }
      const response = await axiosInstance.put(`/api/v1/farmer-product/update-status/${id}`, payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log("Update Status Response:", {
        status: response.status,
        data: response.data,
        payload,
        url: `/api/v1/farmer-product/update-status/${id}`,
        productId: id,
      })
      setSoldOutSuccess(response.data.message || "Product marked as sold out")
      setSoldOutId(null)
      onRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to mark as sold out. Trying alternative payload..."
      console.error("Update Status Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: `/api/v1/farmer-product/update-status/${id}`,
        payload: { status: "Sold Out" },
        productId: id,
      })
      setSoldOutError(errorMessage)
      if (err.response?.status === 400) {
        try {
          const fallbackPayload = { isSoldOut: true }
          const fallbackResponse = await axiosInstance.put(`/api/v1/farmer-product/update-status/${id}`, fallbackPayload, {
            headers: { "Content-Type": "application/json", accept: "*/*" },
          })
          console.log("Update Status Fallback Response:", {
            status: fallbackResponse.status,
            data: fallbackResponse.data,
            payload: fallbackPayload,
            url: `/api/v1/farmer-product/update-status/${id}`,
            productId: id,
          })
          setSoldOutSuccess(fallbackResponse.data.message || "Product marked as sold out")
          setSoldOutId(null)
          onRefresh()
        } catch (fallbackErr: any) {
          const fallbackErrorMessage = fallbackErr.response?.data?.message || "Failed to mark as sold out with fallback payload. Please check product ID or authentication."
          console.error("Update Status Fallback Error:", {
            message: fallbackErr.message,
            response: fallbackErr.response?.data,
            status: fallbackErr.response?.status,
            url: `/api/v1/farmer-product/update-status/${id}`,
            payload: { isSoldOut: true },
            productId: id,
          })
          setSoldOutError(fallbackErrorMessage)
        }
      }
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
                    <TableCell>{getStatusBadge(product.status, product.quantity)}</TableCell>
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
                          {product.quantity > 0 && product.quantity < 20 && (
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
                          )}
                          {product.quantity > 0 && product.status !== "Sold Out" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className={isLoadingAction === `soldout-${product.id}` ? 
                                    "bg-red-600 hover:bg-red-700 text-white" : 
                                    "bg-red-600 hover:bg-red-700 text-white"}
                                  onClick={() => handleMarkSoldOut(product.id)}
                                  disabled={isLoadingAction === `soldout-${product.id}`}
                                >
                                  {isLoadingAction === `soldout-${product.id}` ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Mark as Sold Out</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      <Dialog open={!!restockSuccess} onOpenChange={() => setRestockSuccess("")}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p className="text-green-600">{restockSuccess}</p>
          <DialogFooter>
            <Button
              onClick={() => setRestockSuccess("")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!soldOutError} onOpenChange={() => setSoldOutError("")}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <p className="text-red-500">{soldOutError}</p>
          <DialogFooter>
            <Button
              onClick={() => setSoldOutError("")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!soldOutSuccess} onOpenChange={() => setSoldOutSuccess("")}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p className="text-green-600">{soldOutSuccess}</p>
          <DialogFooter>
            <Button
              onClick={() => setSoldOutSuccess("")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
