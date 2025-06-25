"use client"
import { Button } from "@/components/ui/button"
import { Plus, Eye, Calendar } from "lucide-react"
import Link from "next/link"

export default function VendorDashboard() {



  return (
    <div className="min-h-screen bg-gray-50 ml-0">
      <div className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Welcome back!
            </p>
          </div>
          <div className="flex gap-2">
          </div>
        </div>
      </div>
    </div>
  )
}
