"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/lib/axiosInstance"

interface MarketHubProduct {
  id: string
  productName: string
  quantity: number
  priceRangeMin: number
  priceRangeMax: number
  location: string
  requiredDeliveryDate: string
  status: string
}

interface SubmitProposalDialogProps {
  request: MarketHubProduct
  farmerId: string
  onRefresh: () => void
  disabled: boolean
}

export default function SubmitProposalDialog({
  request,
  farmerId,
  onRefresh,
  disabled,
}: SubmitProposalDialogProps) {
  const [offerPrice, setOfferPrice] = useState("")
  const [deliveryCharge, setDeliveryCharge] = useState("")
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmitProposal = async () => {
    if (!offerPrice || Number(offerPrice) <= 0) {
      setResponseMessage("Please enter a valid price per unit.")
      return
    }

    setIsSubmitting(true)
    setResponseMessage(null)

    try {
      const payload = {
        marketHubId: request.id,
        farmerId,
        offerPricePerUnit: Number(offerPrice),
        deliveryCharge: Number(deliveryCharge || 0),
      }

      console.log("Submitting proposal:", payload)

      const response = await axiosInstance.post("/api/v1/market-proposal/create", payload, {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
      })

      setResponseMessage("Proposal submitted successfully!")
      setOfferPrice("")
      setDeliveryCharge("")
      onRefresh()
      
      // Auto-close after success
      setTimeout(() => setIsOpen(false), 1500)
    } catch (err: any) {
      console.error("Proposal error:", err.response?.data)
      const msg = err.response?.data?.message || "Failed to submit proposal."
      setResponseMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          disabled={disabled || isSubmitting}
        >
          Submit Proposal
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Submit Your Proposal</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="text-center bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg">{request.productName}</h3>
            <p className="text-sm text-gray-600">
              {request.quantity} units • Delivery by {new Date(request.requiredDeliveryDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">{request.location}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="price">Your Price Per Unit (₹)</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g. 45"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                min="1"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="delivery">
                Delivery Charge (₹) <span className="text-gray-400 text-xs">(optional)</span>
              </Label>
              <Input
                id="delivery"
                type="number"
                placeholder="e.g. 100 (or leave 0)"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                min="0"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p>Vendor expects: ₹{request.priceRangeMin} - ₹{request.priceRangeMax}/unit</p>
          </div>

          {responseMessage && (
            <div
              className={`p-3 rounded-md text-center font-medium text-sm ${
                responseMessage.includes("successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {responseMessage}
            </div>
          )}

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={handleSubmitProposal}
            disabled={isSubmitting || !offerPrice}
          >
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}