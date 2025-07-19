"use client"

import type React from "react"
import { useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: string
  category: string
}

export default function ProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState("")

  const [productList] = useState<Product[]>([
    { id: "1", name: "Tomato", category: "Vegetables" },
    { id: "2", name: "Apple", category: "Fruits" },
    { id: "3", name: "Spinach", category: "Grains" },
  ])

  const [formData, setFormData] = useState({
    name: "",
    category: "",
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
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
        setImageUrl("") // clear image URL if file used
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url)
    setImagePreview(url)
    setImageFile(null) // clear file if URL used
  }

  const removeImage = () => {
    setImagePreview(null)
    setImageUrl("")
    setImageFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation (optional)
    if (!formData.name.trim() || !formData.category.trim() || (!imageUrl && !imageFile)) {
      alert("Please fill in all fields including image.")
      return
    }

    const finalImage = imageUrl || (imageFile ? imagePreview : "")

    const newProduct = {
      ...formData,
      image: finalImage,
    }

    console.log("Submitted product:", newProduct)

    // Show alert dialog
    alert("Product has been added successfully.")

    // Clear all fields
    setFormData({ name: "", category: "" })
    setImageUrl("")
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Enter name, category, and upload an image</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label>Product Name *</Label>
              <Input
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>

            {/* Image Upload or URL */}
            <div className="space-y-2">
              <Label>Image (Upload or URL)</Label>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center border border-dashed border-gray-400 rounded-md p-2 cursor-pointer hover:bg-gray-100"
                >
                  <ImagePlus className="h-5 w-5 mr-2" />
                  Choose Image
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <Input
                type="text"
                placeholder="Or paste image URL"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
              />

              {imagePreview && (
                <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-md border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
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
            </div>

            {/* Category - enter or select */}
            <div className="space-y-2">
              <Label>Category *</Label>
              <Input
                placeholder="Enter category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              />
              <Select onValueChange={(val) => handleChange("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Or select category" />
                </SelectTrigger>
                <SelectContent>
                  {productList.map((product) => (
                    <SelectItem key={product.id} value={product.category}>
                      {product.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button className="bg-green-600 hover:bg-green-700 text-white" type="submit">
              Save Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
