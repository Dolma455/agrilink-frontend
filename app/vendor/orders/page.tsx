
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Eye, Filter, Package, Search, Trash } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import axiosInstance from "@/lib/axiosInstance"

interface Proposal {
  id: string
  offerPricePerUnit: number
  status: string
  proposedAt: string
  farmer: string
  productName: string
  quantity: number
  requiredDeliveryDate: string
  location: string
  priceRangeMin: number
  priceRangeMax: number
  productImageUrl: string
  unitName: string
}

export default function VendorOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/api/v1/market-proposal/get-proposals")
        console.log("Fetch Accepted Proposals Response:", {
          status: response.status,
          data: response.data,
          url: "/api/v1/market-proposal/get-proposals",
        })
        // Filter for Accepted proposals only
        const acceptedProposals = (response.data.data || []).filter((proposal: Proposal) => proposal.status === "Accepted")
        setProposals(acceptedProposals)
      } catch (err: any) {
        console.error("Fetch Accepted Proposals Error:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        })
        setProposals([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProposals()
  }, [refreshKey])

  const handleDelete = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/market-proposal/${id}`)
      console.log("Delete Proposal Response:", {
        status: response.status,
        data: response.data,
        url: `/api/v1/market-proposal/${id}`,
      })
      setProposals(proposals.filter(proposal => proposal.id !== id))
    } catch (err: any) {
      console.error("Delete Proposal Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Accepted: { label: "Accepted", variant: "default" as const, icon: Package, color: "bg-green-100 text-green-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: "Accepted",
      variant: "default" as const,
      icon: Package,
      color: "bg-green-100 text-green-800",
    }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch = proposal.productName.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesDate = true
    if (dateFilter !== "all") {
      const proposalDate = new Date(proposal.proposedAt)
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = proposalDate.toDateString() === today.toDateString()
      } else if (dateFilter === "week") {
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = proposalDate >= lastWeek
      } else if (dateFilter === "month") {
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = proposalDate >= lastMonth
      }
    }

    return matchesSearch && matchesDate
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Accepted Orders</h1>
            <p className="text-muted-foreground">Track all your accepted proposals</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Product"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDateFilter("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accepted Orders ({filteredProposals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading accepted orders...</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Offer Price</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Proposed At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell>{proposal.productName}</TableCell>
                        <TableCell>{proposal.quantity} {proposal.unitName}</TableCell>
                        <TableCell>Rs. {proposal.offerPricePerUnit}/unit</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{proposal.farmer}</div>
                            <div className="text-xs text-muted-foreground">{proposal.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                        <TableCell>{new Date(proposal.proposedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedProposal(proposal)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Order Details</DialogTitle>
                                {selectedProposal && (
                                  <div className="space-y-2">
                                    <img
                                      src={selectedProposal.productImageUrl}
                                      alt={selectedProposal.productName}
                                      className="w-full h-48 object-cover rounded-md"
                                      onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                                    />
                                    <p><strong>Product:</strong> {selectedProposal.productName}</p>
                                    <p><strong>Quantity:</strong> {selectedProposal.quantity} {selectedProposal.unitName}</p>
                                    <p><strong>Offer Price:</strong> Rs. {selectedProposal.offerPricePerUnit}/unit</p>
                                    <p><strong>Price Range:</strong> Rs. {selectedProposal.priceRangeMin}-{selectedProposal.priceRangeMax}/unit</p>
                                    <p><strong>Farmer:</strong> {selectedProposal.farmer}</p>
                                    <p><strong>Status:</strong> {selectedProposal.status}</p>
                                    <p><strong>Proposed At:</strong> {new Date(selectedProposal.proposedAt).toLocaleString()}</p>
                                    <p><strong>Delivery Date:</strong> {new Date(selectedProposal.requiredDeliveryDate).toLocaleDateString()}</p>
                                    <p><strong>Location:</strong> {selectedProposal.location}</p>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(proposal.id)}>
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
