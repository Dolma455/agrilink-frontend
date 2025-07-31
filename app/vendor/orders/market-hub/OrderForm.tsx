
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { AddProduct } from "@/app/type"

interface OrderFormProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  vendorId: string
  productList: AddProduct[]
  productLoading: boolean
  productError: string | null
  onRefresh: () => void
}

export default function OrderForm({
  isOpen,
  setIsOpen,
  vendorId,
  productList,
  productLoading,
  productError,
  onRefresh,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    vendorId,
    productId: "",
    quantity: 0,
    requiredDeliveryDate: new Date().toISOString().split('T')[0],
    location: "",
    priceRangeMin: 0,
    priceRangeMax: 0,
    additionalInfo: "",
  })
  const [quantityInput, setQuantityInput] = useState<string>("")
  const [priceMinInput, setPriceMinInput] = useState<string>("")
  const [priceMaxInput, setPriceMaxInput] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("OrderForm productList:", productList)
    if (isOpen) {
      setFormData({
        vendorId,
        productId: "",
        quantity: 0,
        requiredDeliveryDate: new Date().toISOString().split('T')[0],
        location: "",
        priceRangeMin: 0,
        priceRangeMax: 0,
        additionalInfo: "",
      })
      setQuantityInput("")
      setPriceMinInput("")
      setPriceMaxInput("")
      setError("")
    }
  }, [isOpen, vendorId, productList])

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

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

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceMinInput(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      handleChange("priceRangeMin", parsed)
    } else {
      handleChange("priceRangeMin", 0)
    }
  }

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPriceMaxInput(value)
    const parsed = parseFloat(value)
    if (!isNaN(parsed)) {
      handleChange("priceRangeMax", parsed)
    } else {
      handleChange("priceRangeMax", 0)
    }
  }

  const handleBlur = (field: "quantity" | "priceRangeMin" | "priceRangeMax") => {
    const value = field === "quantity" ? quantityInput : field === "priceRangeMin" ? priceMinInput : priceMaxInput
    const parsed = parseFloat(value)
    if (isNaN(parsed) || value === "") {
      setFormData((prev) => ({ ...prev, [field]: 0 }))
      field === "quantity" ? setQuantityInput("0") : field === "priceRangeMin" ? setPriceMinInput("0") : setPriceMaxInput("0")
    } else {
      const formatted = parsed.toString()
      setFormData((prev) => ({ ...prev, [field]: parsed }))
      field === "quantity" ? setQuantityInput(formatted) : field === "priceRangeMin" ? setPriceMinInput(formatted) : setPriceMaxInput(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.productId?.trim()) {
      setError("Please select a product.")
      return
    }
    if (isNaN(formData.quantity) || formData.quantity <= 0) {
      setError("Please enter a valid quantity greater than 0.")
      return
    }
    if (!formData.requiredDeliveryDate?.trim()) {
      setError("Please select a delivery date.")
      return
    }
    if (!formData.location?.trim()) {
      setError("Please enter a location.")
      return
    }
    if (isNaN(formData.priceRangeMin) || formData.priceRangeMin <= 0) {
      setError("Please enter a valid minimum price greater than 0.")
      return
    }
    if (isNaN(formData.priceRangeMax) || formData.priceRangeMax <= 0) {
      setError("Please enter a valid maximum price greater than 0.")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        vendorId: formData.vendorId,
        productId: formData.productId,
        quantity: formData.quantity,
        requiredDeliveryDate: new Date(formData.requiredDeliveryDate).toISOString(),
        location: formData.location,
        priceRangeMin: formData.priceRangeMin,
        priceRangeMax: formData.priceRangeMax,
        additionalInfo: formData.additionalInfo,
      }
      const response = await axiosInstance.post("/api/v1/marketHub/create", payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      })
      console.log("Place Order Response:", {
        status: response.status,
        data: response.data,
        payload,
        url: "/api/v1/marketHub/create",
        authToken: localStorage.getItem("authToken"),
      })
      setIsLoading(false)
      setIsOpen(false)
      onRefresh()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to place order. Please try again."
      console.error("Place Order Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: "/api/v1/marketHub/create",
        authToken: localStorage.getItem("authToken"),
      })
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Product *</Label>
        <Select
          value={formData.productId || ""}
          onValueChange={(val) => handleChange("productId", val)}
          disabled={productLoading || isLoading || !!productError}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              productLoading ? "Loading products..." :
              productError ? "Error loading products" :
              productList.length > 0 ? "Select a product" : "No products available"
            } />
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
        {productError && (
          <div className="flex items-center gap-2">
            <p className="text-red-500 text-sm">{productError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={productLoading || isLoading}
            >
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Category *</Label>
        <Input
          value={productList.find((p) => p.id === formData.productId)?.categoryName || ""}
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label>Quantity *</Label>
        <Input
          type="text"
          value={quantityInput}
          onChange={handleQuantityChange}
          onBlur={() => handleBlur("quantity")}
          placeholder="Enter quantity"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>Required Delivery Date *</Label>
        <Input
          type="date"
          value={formData.requiredDeliveryDate}
          onChange={(e) => handleChange("requiredDeliveryDate", e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label>Location *</Label>
        <Input
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Enter location"
          required
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price Range Min (Rs.) *</Label>
          <Input
            type="text"
            value={priceMinInput}
            onChange={handlePriceMinChange}
            onBlur={() => handleBlur("priceRangeMin")}
            placeholder="Enter minimum price"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label>Price Range Max (Rs.) *</Label>
          <Input
            type="text"
            value={priceMaxInput}
            onChange={handlePriceMaxChange}
            onBlur={() => handleBlur("priceRangeMax")}
            placeholder="Enter maximum price"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Information</Label>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
          placeholder="Add additional information"
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        disabled={isLoading || !!productError}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  )
}
