
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/lib/axiosInstance"

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

interface SubmitProposalDialogProps {
  request: MarketHubProduct
  farmerId: string
  onRefresh: () => void
  disabled: boolean
}

export default function SubmitProposalDialog({ request, farmerId, onRefresh, disabled }: SubmitProposalDialogProps) {
  const [offerPrice, setOfferPrice] = useState("")
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmitProposal = async (marketHubId: string) => {
    if (!offerPrice || isNaN(Number(offerPrice))) {
      setResponseMessage("Please enter a valid offer price.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        marketHubId,
        farmerId,
        offerPricePerUnit: Number(offerPrice),
      }
      const response = await axiosInstance.post("/api/v1/market-proposal/create", payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log("Submit Proposal Response:", {
        status: response.status,
        data: response.data,
        url: "/api/v1/market-proposal/create",
        payload,
      })
      setResponseMessage(response.data.message || "Proposal submitted successfully!")
      setOfferPrice("")
      onRefresh()
    } catch (err: any) {
      console.error("Submit Proposal Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: "/api/v1/market-proposal/create",
      })
      setResponseMessage(err.response?.data?.message || "Failed to submit proposal. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setOfferPrice("")
          setResponseMessage(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
        >
          Submit Proposal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Proposal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {responseMessage?.includes("successfully") ? (
            <div className="space-y-2">
              <p className="text-sm text-green-600">{responseMessage}</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price Per Unit (Rs.)</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  placeholder="Enter your offer price"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">
                  Price Range: Rs. {request.priceRangeMin}-{request.priceRangeMax}/unit
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => handleSubmitProposal(request.id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
              {responseMessage && !responseMessage.includes("successfully") && (
                <p className="text-sm text-red-600">{responseMessage}</p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
