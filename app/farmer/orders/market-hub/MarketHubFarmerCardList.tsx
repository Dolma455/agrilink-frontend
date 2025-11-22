import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, MapPin, Calendar } from "lucide-react"
import SubmitProposalDialog from "./SubmitProposalDialog"

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
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 border-2">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">
          {order.productName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <img
          src={imageUrl}
          alt={order.productName}
          className="w-full h-56 object-cover rounded-xl"
          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
        />

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
              <div className="mt-3 p-3 bg-green-100 rounded-lg text-center font-bold text-green-800">
                {order.status}
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