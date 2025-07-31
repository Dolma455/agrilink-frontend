
"use client"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, PackageCheck, PackageX, AlertTriangle } from "lucide-react"

interface MarketHubProduct {
  id: string
  vendorId: string
  productId: string
  productName: string
  quantity: number
  requiredDeliveryDate: string
  location: string
  priceRangeMin: number
  priceRangeMax: number
  additionalInfo: string
  status: string
  createdAt: string
}

interface AddProduct {
  id: string
  name: string
  categoryName: string
  imageUrl?: string
}

interface MarketHubCardListProps {
  products: MarketHubProduct[]
  productList: AddProduct[]
  isLoading: boolean
  onRefresh: () => void
}

export default function MarketHubCardList({ products, productList, isLoading }: MarketHubCardListProps) {
  useEffect(() => {
    console.log("productList for images:", productList.map(p => ({ id: p.id, imageUrl: p.imageUrl })))
  }, [productList])

  const getProductImage = (productId: string) => {
    const product = productList.find((p) => p.id === productId)
    console.log("getProductImage:", { productId, found: !!product, imageUrl: product?.imageUrl || "/placeholder.jpg" })
    return product?.imageUrl || "/placeholder.jpg"
  }

  const getStatusBadge = (status: string, quantity: number) => {
    if (status === "Closed" || quantity === 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <PackageX className="h-3 w-3" />
          Closed
        </div>
      )
    } else if (quantity > 0 && quantity < 20) {
      return (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <PackageCheck className="h-3 w-3" />
          Open
        </div>
      )
    }
  }

  if (isLoading) return <p>Loading orders...</p>

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No order requests found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((request) => {
        const imageUrl = getProductImage(request.productId)
        return (
          <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{request.productName}</CardTitle>
              <p className="text-sm text-gray-500">Order Request</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {imageUrl && imageUrl !== "/placeholder.jpg" ? (
                  <img
                    src={imageUrl}
                    alt={request.productName}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      console.log("Image load error for:", { productId: request.productId, src: e.currentTarget.src })
                      e.currentTarget.src = "/placeholder.jpg"
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{request.productName}</h3>
                  <p className="text-sm text-gray-600">{request.additionalInfo}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span>{request.quantity} units</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">
                      Rs. {request.priceRangeMin}-{request.priceRangeMax}/unit
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{new Date(request.requiredDeliveryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status, request.quantity)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
