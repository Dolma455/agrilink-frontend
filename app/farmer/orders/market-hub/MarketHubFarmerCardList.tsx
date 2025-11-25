import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MapPin, Calendar } from "lucide-react"
import SubmitProposalDialog from "./SubmitProposalDialog"
import { useState } from "react"

interface MarketHubCardProps {
  order: any
  imageUrl: string
  farmerId: string
  onProposalSubmitted: () => void
  isSubmitted?: boolean
  submittedData?: any
}

export default function MarketHubCard({ 
  order, 
  imageUrl, 
  farmerId, 
  onProposalSubmitted,
  isSubmitted = false,
  submittedData
}: MarketHubCardProps) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          {order.productName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {imageLoading && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 font-medium">Loading image...</span>
              </div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Package className="w-16 h-16" />
                <span className="text-sm font-medium">{order.productName}</span>
              </div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={order.productName}
            className={`w-full h-56 object-cover transition-opacity duration-500 ${
              imageLoading || imageError ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => {
              setImageLoading(false)
              setImageError(false)
            }}
            onError={() => {
              setImageLoading(false)
              setImageError(true)
            }}
            style={{ display: imageError ? 'none' : 'block' }}
          />
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <span className="font-medium">{order.quantity} units</span>
          </div>

          {isSubmitted ? (
            <>
              <div className="text-green-600 font-bold text-xl">
                Your Offer: ₹{order.priceRangeMin}/unit
              </div>
              <div>Delivery Charge: ₹{submittedData?.deliveryCharge || 0}</div>
              <div className="text-xs text-gray-600">
                Submitted: {new Date(submittedData?.proposedAt).toLocaleDateString()}
              </div>
            </>
          ) : (
            <>
              <div className="text-green-600 font-bold text-lg">
                ₹{order.priceRangeMin} - ₹{order.priceRangeMax}/unit
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span>{new Date(order.requiredDeliveryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span>{order.location}</span>
              </div>
            </>
          )}

          {!isSubmitted && (
            <SubmitProposalDialog
              request={order}
              farmerId={farmerId}
              onRefresh={onProposalSubmitted}
              disabled={false}
            />
          )}

          {isSubmitted && (
            <div className="p-4 bg-green-100 rounded-lg text-center font-bold text-green-800">
              Proposal Submitted
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}