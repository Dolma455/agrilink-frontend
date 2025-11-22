"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Calendar, MapPin, User, Mail, Phone, AlertTriangle } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"

interface Proposal {
  marketHubId: string
  id: string
  offerPricePerUnit: number
  deliveryCharge: number
  status: string
  proposedAt: string
  farmerId: string
  farmerName: string
  productName: string
  quantity: number
  unitName: string
  location: string
  requiredDeliveryDate: string
  productImageUrl?: string
  email?: string
  phone?: string
  address?: string
  farmSize?: string
}

export default function VendorRequests() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseMessage, setResponseMessage] = useState("")
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null)

  const vendorId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  // Fetch only vendor's proposals using the correct endpoint
  const fetchProposals = async () => {
    if (!vendorId) {
      setError("Please log in to view proposals")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await axiosInstance.get("/api/v1/market-proposal/get-all-proposals", {
        params: { vendorId }  // This is the key — same as farmer side but with vendorId
      })

      const data = res.data.data || []
      // Filter only pending proposals
      const pending = data.filter((p: any) => 
        p.status !== "Accepted" && p.status !== "Rejected"
      )
      setProposals(pending)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load proposals")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [vendorId])

  const handleAction = async (id: string, action: "accept" | "reject") => {
    try {
      const proposal = proposals.find(p => p.id === id)
      if (!proposal) return

      if (action === "accept") {
        await axiosInstance.post("/api/order/create", {
          marketProposalId: id,
          vendorId,
          marketHubId: proposal.marketHubId || proposal.id,
          quantity: proposal.quantity,
        })
        setResponseMessage("Proposal accepted successfully!")
      } else {
        await axiosInstance.patch("/api/v1/market-proposal/reject", {
          marketProposalId: id,
          vendorId,
        })
        setResponseMessage("Proposal rejected")
      }

      // Remove from list
      setProposals(prev => prev.filter(p => p.id !== id))
      setIsResponseOpen(true)
    } catch (err: any) {
      setResponseMessage(err.response?.data?.message || "Action failed")
      setIsResponseOpen(true)
    } finally {
      setIsConfirmOpen(false)
      setPendingAction(null)
    }
  }

  if (isLoading) return <div className="min-h-screen bg-gray-50 p-6">Loading proposals...</div>
  if (error) return <div className="min-h-screen bg-gray-50 p-6 text-red-600 text-center">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Requests by Farmers</h1>
          <p className="text-muted-foreground">These are the proposals sent by farmers</p>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to {pendingAction?.action} this proposal?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button
                className={pendingAction?.action === "accept" ? "bg-green-600" : "bg-red-600"}
                onClick={() => pendingAction && handleAction(pendingAction.id, pendingAction.action)}
              >
                {pendingAction?.action === "accept" ? "Accept" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Response Dialog */}
        <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Result</DialogTitle>
              <DialogDescription>{responseMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setIsResponseOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No pending proposals</p>
            </div>
          ) : (
            proposals.map((p, i) => (
              <Card key={p.id} className={`p-4 ${i % 2 === 0 ? "bg-red-50" : "bg-green-50"}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedProposal(p)}
                          className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <User className="h-5 w-5" />
                          {p.farmerName}
                        </button>
                      </DialogTrigger>
                      {selectedProposal?.id === p.id && (
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{p.farmerName}'s Profile</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex gap-3"><Mail className="h-6 w-6 text-blue-500" /> <div><strong>Email:</strong> {p.email}</div></div>
                            <div className="flex gap-3"><Phone className="h-6 w-6 text-blue-500" /> <div><strong>Phone:</strong> {p.phone}</div></div>
                            <div className="flex gap-3"><MapPin className="h-6 w-6 text-blue-500" /> <div><strong>Address:</strong> {p.address}</div></div>
                            <div className="flex gap-3"><MapPin className="h-6 w-6 text-blue-500" /> <div><strong>Farm Size:</strong> {p.farmSize}</div></div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <div className="font-medium">{p.productName}</div>
                    <div className="text-sm flex gap-4">
                      <span>{p.quantity} {p.unitName}</span>
                      <span className="font-bold text-green-600">Rs. {p.offerPricePerUnit}/unit</span>
                      {p.deliveryCharge > 0 && <span className="text-gray-600">+ ₹{p.deliveryCharge} delivery</span>}
                    </div>
                    <div className="text-sm text-gray-500 flex gap-4">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(p.proposedAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setPendingAction({ id: p.id, action: "accept" })
                        setIsConfirmOpen(true)
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        setPendingAction({ id: p.id, action: "reject" })
                        setIsConfirmOpen(true)
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}