"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Package, User } from "lucide-react"
import Image from "next/image"

// Mock data for vendor order requests
const orderRequests = [
  {
    id: 1,
    vendorName: "Fresh Market Co.",
    product: "Organic Tomatoes",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "500 kg",
    maxPrice: "$3.50/kg",
    deliveryDate: "2024-01-15",
    location: "Downtown Market",
    description: "High-quality organic tomatoes for retail distribution",
    urgency: "high",
    category: "Vegetables",
  },
  {
    id: 2,
    vendorName: "Green Grocers Ltd.",
    product: "Fresh Carrots",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "300 kg",
    maxPrice: "$2.20/kg",
    deliveryDate: "2024-01-18",
    location: "City Center",
    description: "Fresh carrots for supermarket chain",
    urgency: "medium",
    category: "Vegetables",
  },
  {
    id: 3,
    vendorName: "Fruit Paradise",
    product: "Premium Apples",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "200 kg",
    maxPrice: "$4.00/kg",
    deliveryDate: "2024-01-20",
    location: "North District",
    description: "Premium quality apples for high-end retail",
    urgency: "low",
    category: "Fruits",
  },
  {
    id: 4,
    vendorName: "Organic Harvest",
    product: "Sweet Potatoes",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "400 kg",
    maxPrice: "$2.80/kg",
    deliveryDate: "2024-01-22",
    location: "West Market",
    description: "Organic sweet potatoes for health food stores",
    urgency: "medium",
    category: "Vegetables",
  },
  {
    id: 5,
    vendorName: "Berry Best",
    product: "Fresh Strawberries",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "150 kg",
    maxPrice: "$8.00/kg",
    deliveryDate: "2024-01-16",
    location: "Central Plaza",
    description: "Premium strawberries for dessert shops",
    urgency: "high",
    category: "Fruits",
  },
  {
    id: 6,
    vendorName: "Leafy Greens Co.",
    product: "Organic Spinach",
    image: "/placeholder.svg?height=200&width=200",
    quantity: "250 kg",
    maxPrice: "$5.50/kg",
    deliveryDate: "2024-01-19",
    location: "East Side Market",
    description: "Fresh organic spinach for restaurants",
    urgency: "medium",
    category: "Leafy Greens",
  },
]

export default function MarketHub() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterUrgency, setFilterUrgency] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter orders based on search and filters
  const filteredRequests = orderRequests.filter((request) => {
    const matchesSearch =
      request.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || request.category === filterCategory
    const matchesUrgency = filterUrgency === "all" || request.urgency === filterUrgency

    return matchesSearch && matchesCategory && matchesUrgency
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSubmitProposal = (requestId: number, proposalData: any) => {
    console.log("Submitting proposal for request:", requestId, proposalData)
    // Here you would typically send the proposal to your backend
    alert("Proposal submitted successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50 ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Hub</h1>
          <p className="text-gray-600">Browse vendor order requests and submit your proposals</p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search products or vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Leafy Greens">Leafy Greens</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <CardTitle className="text-lg">{request.vendorName}</CardTitle>
                      <p className="text-sm text-gray-500">Vendor</p>
                    </div>
                  </div>
                  <Badge className={getUrgencyColor(request.urgency)}>{request.urgency}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Product Image */}
                <div className="mb-4">
                  <Image
                    src={request.image || "/placeholder.svg"}
                    alt={request.product}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{request.product}</h3>
                    <p className="text-sm text-gray-600">{request.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span>{request.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">{request.maxPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{request.deliveryDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{request.location}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => setSelectedRequest(request)}
                      >
                        Submit Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Submit Proposal</DialogTitle>
                      </DialogHeader>
                      <ProposalForm
                        request={selectedRequest}
                        onSubmit={(data) => handleSubmitProposal(selectedRequest?.id, data)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No order requests found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Proposal Form Component
function ProposalForm({ request, onSubmit }: { request: any; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    price: "",
    quantity: "",
    deliveryDate: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!request) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="price">Your Price (per kg)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          placeholder="Enter your price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Max price: {request.maxPrice}</p>
      </div>

      <div>
        <Label htmlFor="quantity">Available Quantity (kg)</Label>
        <Input
          id="quantity"
          type="number"
          placeholder="Enter available quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Requested: {request.quantity}</p>
      </div>

      <div>
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500 mt-1">Required by: {request.deliveryDate}</p>
      </div>

      <div>
        <Label htmlFor="message">Additional Message</Label>
        <Textarea
          id="message"
          placeholder="Any additional information about your proposal..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Submit Proposal
      </Button>
    </form>
  )
}
