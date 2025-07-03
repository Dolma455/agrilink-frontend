"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: string
  name: string
  image?: string
  category: string
}

interface FormProduct {
  name: string
  image?: string
  category: string
  description?: string
  quantity: number
  unit: string
  price: number
}

export default function ProductForm() {
  const router = useRouter()

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [productList, setProductList] = useState<Product[]>([])

  const [formData, setFormData] = useState<FormProduct>({
    name: "",
    image: "",
    category: "",
    description: "",
    quantity: 0,
    unit: "kg",
    price: 0,
  })

  const unitOptions = ["kg", "liter", "piece", "dozen", "quintal", "ton", "meter"]

  useEffect(() => {
    const dummyProducts: Product[] = [
      {
        id: "1",
        name: "Tomato",
        image: "/assets/images/tomatoes.jpg", 
        category: "Vegetables",
      },
      {
        id: "2",
        name: "Apple",
        image: "/assets/images/apples.jpg", 
        category: "Fruits",
      },
      {
        id: "3",
        name: "Spinach",
        image: "/assets/images/spinach.jpg", 
        category: "Grains",
      },
    ]
    setProductList(dummyProducts)
  }, [])

  const handleChange = (field: keyof FormProduct, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        handleChange("image", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    handleChange("image", "")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting product:", formData)
    router.push("/success")
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Select product and fill in quantity & price</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Product Dropdown */}
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select
                onValueChange={(selectedId) => {
                  const selected = productList.find((p) => p.id === selectedId)
                  if (selected) {
                    handleChange("name", selected.name)
                    handleChange("category", selected.category)
                    handleChange("image", selected.image)
                    setImagePreview(selected.image || null)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {productList.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={formData.category} readOnly />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Add product description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <Separator />

            {/* Quantity & Unit */}
            <div className="flex gap-4">
              <div className="w-1/2 space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", parseFloat(e.target.value))}
                  placeholder="e.g. 10"
                />
              </div>
              <div className="w-1/2 space-y-2">
                <Label>Unit</Label>
                <Select value={formData.unit} onValueChange={(val) => handleChange("unit", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label>Price per unit (Rs.)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                placeholder="e.g.50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white" type="submit">
              Add Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
