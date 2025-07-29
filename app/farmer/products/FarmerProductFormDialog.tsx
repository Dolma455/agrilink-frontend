
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { FarmerProductFormProps, AddProduct } from "../../type"

interface ProductFormDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSave: (formData: Partial<FarmerProductFormProps>) => Promise<void>
  farmerId: string
  productList: AddProduct[]
}

export default function ProductFormDialog({
  isOpen,
  setIsOpen,
  onSave,
  farmerId,
  productList,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Partial<FarmerProductFormProps>>({
    farmerId,
    productId: "",
    quantity: 0,
    pricePerUnit: 0,
    availableFrom: new Date().toISOString().split('T')[0],
    description: "",
  })
  const [quantityInput, setQuantityInput] = useState<string>("")
  const [priceInput, setPriceInput] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        farmerId,
        productId: "",
        quantity: 0,
        pricePerUnit: 0,
        availableFrom: new Date().toISOString().split('T')[0],
        description: "",
      })
      setQuantityInput("")
      setPriceInput("")
      setError("")
    }
  }, [isOpen, farmerId])

  // Form field change handler
  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  // Quantity input handler
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantityInput(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      handleChange("quantity", parsed)
    } else {
      handleChange("quantity", 0)
    }
  }

  // Price input handler
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceInput(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      handleChange("pricePerUnit", parsed)
    } else {
      handleChange("pricePerUnit", 0)
    }
  }

  // Blur handler to normalize inputs
  const handleBlur = (field: "quantity" | "pricePerUnit") => {
    const value = field === "quantity" ? quantityInput : priceInput
    const parsed = parseFloat(value)
    if (isNaN(parsed) || value === "") {
      setFormData((prev) => ({ ...prev, [field]: 0 }))
      field === "quantity" ? setQuantityInput("0") : setPriceInput("0")
    } else {
      const formatted = parsed.toString()
      setFormData((prev) => ({ ...prev, [field]: parsed }))
      field === "quantity" ? setQuantityInput(formatted) : setPriceInput(formatted)
    }
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.productId?.trim()) {
      setError("Please select a product.")
      return
    }
    if (isNaN(formData.quantity ?? 0) || (formData.quantity ?? 0) < 0) {
      setError("Please enter a valid non-negative quantity.")
      return
    }
    if (isNaN(formData.pricePerUnit ?? 0) || (formData.pricePerUnit ?? 0) <= 0) {
      setError("Price per unit must be greater than zero.")
      return
    }
    if (!formData.availableFrom?.trim()) {
      setError("Available from date is required.")
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      setIsLoading(false)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setFormData({
            farmerId,
            productId: "",
            quantity: 0,
            pricePerUnit: 0,
            availableFrom: new Date().toISOString().split('T')[0],
            description: "",
          })
          setQuantityInput("")
          setPriceInput("")
          setError("")
          setIsLoading(false)
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Product *</Label>
            <Select
              value={formData.productId || ""}
              onValueChange={(val) => handleChange("productId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {productList.length > 0 ? (
                  productList.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No products available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              value={productList.find((p) => p.id === formData.productId)?.categoryName || ""}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Add product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="text"
                value={quantityInput}
                onChange={handleQuantityChange}
                onBlur={() => handleBlur("quantity")}
                placeholder="Enter quantity"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Price per unit (Rs.) *</Label>
              <Input
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                onBlur={() => handleBlur("pricePerUnit")}
                placeholder="Enter price"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available From *</Label>
            <Input
              type="date"
              value={formData.availableFrom}
              onChange={(e) => handleChange("availableFrom", e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
