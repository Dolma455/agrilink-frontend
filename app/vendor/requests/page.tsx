"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, MapPin, User, Mail, Phone } from "lucide-react"

const initialFarmerRequests = [
  {
    id: 1,
    farmerName: "ABC Farmer",
    product: "Tomatoes",
    quantity: "80 kg",
    price: "Rs. 60/kg",
    date: "2025-02-03",
    location: "Sankhu, Kathmandu",
    bgColor: "bg-red-50",
    email: "abc.farmer@example.com",
    phone: "+977-123-456-7890",
    address: "123 Farm Road, Sankhu",
    farmSize: "5 acres",
  },
  {
    id: 2,
    farmerName: "LMN Farmer",
    product: "Tomatoes",
    quantity: "80 kg",
    price: "Rs. 60/kg",
    date: "2025-02-03",
    location: "Sankhu, Kathmandu",
    bgColor: "bg-green-50",
    email: "lmn.farmer@example.com",
    phone: "+977-987-654-3210",
    address: "456 Green Lane, Sankhu",
    farmSize: "3 acres",
  },
  {
    id: 3,
    farmerName: "XYZ Farmer",
    product: "Tomatoes",
    quantity: "80 kg",
    price: "Rs. 60/kg",
    date: "2025-02-03",
    location: "Sankhu, Kathmandu",
    bgColor: "bg-red-50",
    email: "xyz.farmer@example.com",
    phone: "+977-555-123-4567",
    address: "789 Harvest Street, Sankhu",
    farmSize: "7 acres",
  },
  {
    id: 4,
    farmerName: "OPQ Farmer",
    product: "Tomatoes",
    quantity: "80 kg",
    price: "Rs. 60/kg",
    date: "2025-02-03",
    location: "Sankhu, Kathmandu",
    bgColor: "bg-green-50",
    email: "opq.farmer@example.com",
    phone: "+977-444-987-6543",
    address: "321 Rural Road, Sankhu",
    farmSize: "4 acres",
  },
]

type FarmerRequest = typeof initialFarmerRequests[number];

export default function VendorRequests() {
  const [farmerRequests, setFarmerRequests] = useState<FarmerRequest[]>(initialFarmerRequests)
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRequest | null>(null)

  const handleAction = (id: number) => {
    setFarmerRequests(farmerRequests.filter((request) => request.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests by Farmers</h1>
          <p className="text-gray-600">These are the requests sent by farmers</p>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {farmerRequests.map((request) => (
            <Card
              key={request.id}
              className={`p-4 border rounded-md ${request.bgColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {/* Farmer Name */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => setSelectedFarmer(request)}
                        className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <User className="h-5 w-5" />
                        {request.farmerName}
                      </button>
                    </DialogTrigger>
                    {selectedFarmer?.id === request.id && (
                      <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-semibold text-gray-800">
                            {selectedFarmer.farmerName}'s Profile
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <User className="h-6 w-6 text-blue-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Name</p>
                              <p className="text-gray-800 font-medium">{selectedFarmer.farmerName}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <Mail className="h-6 w-6 text-blue-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email</p>
                              <p className="text-gray-800">{selectedFarmer.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <Phone className="h-6 w-6 text-blue-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phone</p>
                              <p className="text-gray-800">{selectedFarmer.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Address</p>
                              <p className="text-gray-800">{selectedFarmer.address}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                            <MapPin className="h-6 w-6 text-blue-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Farm Size</p>
                              <p className="text-gray-800">{selectedFarmer.farmSize}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>

                  <div className="text-sm font-medium text-gray-700">{request.product}</div>
                  <div className="text-sm flex gap-4">
                    <span className="text-gray-600">{request.quantity}</span>
                    <span className="text-green-600 font-semibold">{request.price}</span>
                  </div>

                  <div className="text-sm flex gap-4 text-gray-500">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> {request.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {request.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center mt-4 sm:mt-0">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                    onClick={() => handleAction(request.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                    onClick={() => handleAction(request.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}