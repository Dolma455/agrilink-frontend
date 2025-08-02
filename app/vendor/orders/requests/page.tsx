"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Calendar, MapPin, User, Mail, Phone, Plus } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"

interface MarketHub {
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

interface Proposal {
  id: string
  offerPricePerUnit: number
  status: string
  proposedAt: string
  deliveryCharge: number
  farmerId: string
  farmer: string
  marketHubId: string
  requiredDeliveryDate: string
  location: string
  quantity: number
  priceRangeMin: number
  priceRangeMax: number
  marketHubStatus: string
  productId: string
  productName: string
  productImageUrl?: string
  unitName: string
  email?: string
  phone?: string
  address?: string
  farmSize?: string
}

export default function VendorRequests() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null)

  // vendor id
  const vendorId = "01983fcf-2a08-7546-9503-c90803cfc607"

  // Mocked farmer details
  const mockFarmerDetails: { [farmerId: string]: { email: string; phone: string; address: string; farmSize: string } } = {
    "019837a2-6d84-78f8-a691-42fca40ad358": {
      email: "local.farmer@example.com",
      phone: "+977-123-456-7890",
      address: "123 Farm Road, Bouddha",
      farmSize: "5 acres",
    },
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch market hubs first
        const marketHubResponse = await axiosInstance.get(`/api/v1/marketHub/vendor?vendorId=${vendorId}`)
        const marketHubs: MarketHub[] = marketHubResponse.data.data || []
        const vendorMarketHubIds = marketHubs.map((hub) => hub.id)
        console.log("Fetched Vendor Market Hub IDs:", vendorMarketHubIds)

        // Fetch proposals
        const proposalResponse = await axiosInstance.get("/api/v1/market-proposal/get-proposals")
        console.log("Fetch Proposals Response:", {
          status: proposalResponse.status,
          data: proposalResponse.data,
          url: "/api/v1/market-proposal/get-proposals",
        })

        const allProposals = proposalResponse.data.data || []
        console.log("All Proposals:", allProposals)

        // Filter for proposals with vendor's marketHubIds and not accepted or rejected
        const vendorProposals = allProposals.filter((proposal: Proposal) =>
          vendorMarketHubIds.includes(proposal.marketHubId) &&
          proposal.status !== "Accepted" &&
          proposal.status !== "Rejected"
        )
        const pendingProposals = vendorProposals.map((proposal: Proposal) => ({
          ...proposal,
          ...mockFarmerDetails[proposal.farmerId] || {
            email: "unknown@example.com",
            phone: "+977-000-000-0000",
            address: "Unknown Address",
            farmSize: "Unknown",
          },
        }))
        console.log("Filtered Proposals:", pendingProposals)
        setProposals(pendingProposals)
      } catch (err: any) {
        console.error("Fetch Error:", {
          message: err.message || "Unknown error",
          response: err.response?.data || null,
          status: err.response?.status || null,
          url: err.response?.config?.url || "Unknown",
        })
        setProposals([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [refreshKey, vendorId])

  const handleAction = async (id: string, action: "accept" | "reject") => {
    const endpoint = action === "accept" ? "/api/order/create" : "/api/v1/market-proposal/reject"
    try {
      const payload = { marketProposalId: id, vendorId }
      const method = action === "accept" ? axiosInstance.post : axiosInstance.patch
      const response = await method(endpoint, payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} Proposal Response:`, {
        status: response.status,
        data: response.data,
        url: endpoint,
        payload,
      })
      setResponseMessage(response.data.message || `${action.charAt(0).toUpperCase() + action.slice(1)}ed successfully`)
      if (response.data.isSuccess) {
        setProposals(proposals.filter((proposal) => proposal.id !== id)) // Remove immediately on success
      }
      setIsResponseDialogOpen(true)
    } catch (err: any) {
      console.error(`${action.charAt(0).toUpperCase() + action.slice(1)} Proposal Error:`, {
        message: err.message || "Unknown error",
        response: err.response?.data || null,
        status: err.response?.status || null,
        url: endpoint || "Unknown endpoint",
      })
      setResponseMessage(err.response?.data?.message || `Failed to ${action} proposal. Please try again.`)
      setIsResponseDialogOpen(true)
    } finally {
      setIsConfirmDialogOpen(false)
      setPendingAction(null)
    }
  }

  const openConfirmDialog = (id: string, action: "accept" | "reject") => {
    setPendingAction({ id, action })
    setIsConfirmDialogOpen(true)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading farmer proposals...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Requests by Farmers</h1>
            <p className="text-muted-foreground">These are the proposals sent by farmers</p>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm {pendingAction?.action === "accept" ? "Accept" : "Reject"}</DialogTitle>
              <DialogDescription>
                Are you sure you want to {pendingAction?.action === "accept" ? "accept" : "reject"} this proposal?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmDialogOpen(false)
                  setPendingAction(null)
                }}
              >
                Cancel
              </Button>
              <Button
                className={pendingAction?.action === "accept" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                onClick={() => {
                  if (pendingAction) {
                    handleAction(pendingAction.id, pendingAction.action)
                  }
                }}
              >
                {pendingAction?.action === "accept" ? "Accept" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Action Result</DialogTitle>
              <DialogDescription>{responseMessage}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsResponseDialogOpen(false)
                  setResponseMessage(null)
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No farmer proposals found</h3>
              <p className="text-gray-500">No pending proposals available at the moment.</p>
            </div>
          ) : (
            proposals.map((proposal, index) => (
              <Card
                key={proposal.id}
                className={`p-4 border rounded-md ${index % 2 === 0 ? "bg-red-50" : "bg-green-50"} shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    {/* Farmer Name */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedProposal(proposal)}
                          className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <User className="h-5 w-5" />
                          {proposal.farmer}
                        </button>
                      </DialogTrigger>
                      {selectedProposal?.id === proposal.id && (
                        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                              {selectedProposal.farmer}'s Profile
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <User className="h-6 w-6 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Name</p>
                                <p className="text-gray-800 font-medium">{selectedProposal.farmer}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <Mail className="h-6 w-6 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-gray-800">{selectedProposal.email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <Phone className="h-6 w-6 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-gray-800">{selectedProposal.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <p className="text-gray-800">{selectedProposal.address}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                              <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Farm Size</p>
                                <p className="text-gray-800">{selectedProposal.farmSize}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    <div className="text-sm font-medium text-gray-700">{proposal.productName}</div>
                    <div className="text-sm flex gap-4">
                      <span className="text-gray-600">{proposal.quantity} {proposal.unitName}</span>
                      <span className="text-green-600 font-semibold">Rs. {proposal.offerPricePerUnit}/unit</span>
                    </div>

                    <div className="text-sm flex gap-4 text-gray-500">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(proposal.proposedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {proposal.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center mt-4 sm:mt-0">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      onClick={() => openConfirmDialog(proposal.id, "accept")}
                    >
                      Accept
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                      onClick={() => openConfirmDialog(proposal.id, "reject")}
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