"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, PackageCheck, ChevronLeft, ChevronRight } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import MarketHubCard from "./MarketHubFarmerCardList"
import { Button } from "@/components/ui/button"

interface MarketHubOrder {
  id: string
  productId: string
  productName: string
  quantity: number
  priceRangeMin: number
  priceRangeMax: number
  location: string
  requiredDeliveryDate: string
  status: string
}

interface SubmittedProposal {
  id: string
  marketHubId: string
  offerPricePerUnit: number
  deliveryCharge: number
  status: string
  proposedAt: string
  productName: string
  quantity: number
  location: string
  requiredDeliveryDate: string
}

export default function FarmerMarketHubPage() {
  const [allOrders, setAllOrders] = useState<MarketHubOrder[]>([])
  const [submittedProposals, setSubmittedProposals] = useState<SubmittedProposal[]>([])
  const [productImages, setProductImages] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [farmerId, setFarmerId] = useState<string>("")
  
  const [ordersPage, setOrdersPage] = useState(1)
  const [proposalsPage, setProposalsPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId")
      if (id) setFarmerId(id)
    }
  }, [])

  const fetchAllOrders = async () => {
    if (!farmerId) return
    try {
      const res = await axiosInstance.get("/api/v1/marketHub/farmer", {
        params: { farmerId },
      })
      setAllOrders(res.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const fetchSubmittedProposals = async () => {
    if (!farmerId) return
    try {
      const res = await axiosInstance.get("/api/v1/market-proposal/get-all-proposals", {
        params: { 
          farmerId,
        },
      })
      console.log("Submitted Proposals Response:", res.data)
      const proposals = res.data.data || []
      console.log("Submitted Proposals Count:", proposals.length)
      setSubmittedProposals(proposals)
    } catch (err) {
      console.error("Error fetching submitted proposals:", err)
    }
  }

  const fetchProductImages = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/product/all")
      const map: { [key: string]: string } = {}
      res.data.data?.forEach((p: any) => {
        map[p.id] = p.imageUrl || "/placeholder.jpg"
      })
      setProductImages(map)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (farmerId) {
      setLoading(true)
      Promise.all([
        fetchAllOrders(),
        fetchSubmittedProposals(),
        fetchProductImages(),
      ]).finally(() => setLoading(false))
    }
  }, [farmerId])

  const handleProposalSubmitted = () => {
    fetchAllOrders()
    fetchSubmittedProposals()
  }

  // Only show orders where farmer has NOT submitted yet
  const availableOrders = allOrders.filter(
    (order) => !submittedProposals.some((p) => p.marketHubId === order.id)
  )

  // Pagination logic
  const totalOrdersPages = Math.ceil(availableOrders.length / itemsPerPage)
  const totalProposalsPages = Math.ceil(submittedProposals.length / itemsPerPage)
  
  const paginatedOrders = availableOrders.slice(
    (ordersPage - 1) * itemsPerPage,
    ordersPage * itemsPerPage
  )
  
  const paginatedProposals = submittedProposals.slice(
    (proposalsPage - 1) * itemsPerPage,
    proposalsPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading Market Hub...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Market Hub</h1>
          <p className="text-gray-600 mt-2">Submit proposals to vendor orders</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="all" className="text-lg">
              <Package className="w-5 h-5 mr-2" />
              All Orders ({availableOrders.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="text-lg">
              <PackageCheck className="w-5 h-5 mr-2" />
              My Proposals ({submittedProposals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {availableOrders.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">No new orders available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedOrders.map((order) => (
                    <MarketHubCard
                      key={order.id}
                      order={order}
                      imageUrl={productImages[order.productId] || "/placeholder.jpg"}
                      farmerId={farmerId}
                      onProposalSubmitted={handleProposalSubmitted}
                    />
                  ))}
                </div>
                
                {totalOrdersPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
                      disabled={ordersPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {ordersPage} of {totalOrdersPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setOrdersPage(p => Math.min(totalOrdersPages, p + 1))}
                      disabled={ordersPage === totalOrdersPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="submitted">
            {submittedProposals.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <PackageCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">No proposals submitted yet</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProposals.map((prop) => {
                    // Find the original order to get productId
                    const originalOrder = allOrders.find(o => o.id === prop.marketHubId)
                    const productId = originalOrder?.productId || prop.marketHubId
                    
                    return (
                      <MarketHubCard
                        key={prop.id}
                        order={{
                          ...prop,
                          id: prop.marketHubId,
                          productId: productId,
                          priceRangeMin: prop.offerPricePerUnit,
                          priceRangeMax: prop.offerPricePerUnit,
                          status: prop.status,
                        }}
                        imageUrl={productImages[productId] || "/placeholder.jpg"}
                        farmerId={farmerId}
                        onProposalSubmitted={() => {}}
                        isSubmitted={true}
                        submittedData={prop}
                      />
                    )
                  })}
                </div>
                
                {totalProposalsPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setProposalsPage(p => Math.max(1, p - 1))}
                      disabled={proposalsPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {proposalsPage} of {totalProposalsPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setProposalsPage(p => Math.min(totalProposalsPages, p + 1))}
                      disabled={proposalsPage === totalProposalsPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}