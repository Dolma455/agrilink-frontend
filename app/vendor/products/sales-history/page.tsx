"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import SalesEntryFormDialog from "./SalesEntryFormDialog"
import SalesHistoryTable from "./SalesHistoryTable"

export default function SalesHistoryPage() {
  const [open, setOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="py-4 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Sales History</h2>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setOpen(true)}>Add Manual Sale</Button>
      </div>

      <SalesEntryFormDialog open={open} onOpenChange={setOpen} onSuccess={handleSuccess} />

      <SalesHistoryTable refreshKey={refreshKey} />
    </div>
  )
}
