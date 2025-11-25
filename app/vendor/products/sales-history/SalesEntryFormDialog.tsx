"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import axiosInstance from "@/lib/axiosInstance"
import { usePostMutation } from "@/lib/fetch-api"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

type Product = {
  productId: string
  productName: string
}

const getVendorId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId") || process.env.NEXT_PUBLIC_VENDOR_ID || ""
  }
  return ""
}

export default function SalesEntryFormDialog({ open, onOpenChange, onSuccess }: Props) {
  const router = useRouter()
  const vendorId = getVendorId()

  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [pricePerUnit, setPricePerUnit] = useState<number>(0)
  const [soldAt, setSoldAt] = useState<string>(() => new Date().toISOString().slice(0, 16))
  const [note, setNote] = useState("")
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Fetch vendor inventory
  useEffect(() => {
    if (!vendorId) return
    setLoadingProducts(true)

    axiosInstance
      .get(`/api/inventory/vendor?vendorId=${vendorId}&page=1&pageSize=1000`)
      .then((res) => {
        const list = res.data.data || []
        const mapped = list.map((p: any) => ({
          productId: p.productId || p.id,
          productName: p.productName || p.name,
        }))
        setProducts(mapped)
      })
      .catch(() => {
        toast.error("Failed to load products")
        setError("Failed to load products")
      })
      .finally(() => setLoadingProducts(false))
  }, [vendorId])

  const mutation = usePostMutation<unknown, any>("/api/inventory/manual-sale", {
    onSuccess: (res: any) => {
      // Treat any HTTP-successful response as a success message from server.
      setSuccessMsg(res?.message || "Sale recorded successfully!")
      setError(null)
      onSuccess && onSuccess()
    },
    onError: (err: any) => {
      setError(err?.response?.data?.message || "Failed to record sale")
      toast.error(err?.response?.data?.message || "Error")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!vendorId) {
      setError("User not logged in. Please log in.")
      router.push("/login")
      return
    }

    if (!productId) {
      setError("Please select a product")
      return
    }

    if (!quantity || quantity <= 0) {
      setError("Quantity must be greater than 0")
      return
    }

    const payload = {
      vendorId,
      productId,
      quantity,
      pricePerUnit,
      soldAt: new Date(soldAt).toISOString(),
      note,
    }

    mutation.mutate(payload)
  }

  const closeAllDialogs = () => {
    setSuccessMsg(null)
    onOpenChange(false)
  }

  return (
    <>
      {/* Main Form Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manual Sale</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-3">
            <div>
              <label className="text-sm">Product</label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {loadingProducts ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    products.map((p) => (
                      <SelectItem key={p.productId} value={p.productId}>
                        {p.productName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Price per Unit</label>
              <Input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className="mt-1"
                placeholder="Enter price per unit"
              />
            </div>

            <div>
              <label className="text-sm">Sold At</label>
              <Input
                type="datetime-local"
                value={soldAt}
                onChange={(e) => setSoldAt(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Note</label>
              <Input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={!!successMsg} onOpenChange={closeAllDialogs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-700">Success</DialogTitle>
          </DialogHeader>

          <p className="text-green-600 font-medium">{successMsg}</p>

          <DialogFooter>
            <Button onClick={closeAllDialogs}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
