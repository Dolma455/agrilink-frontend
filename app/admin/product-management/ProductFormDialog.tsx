
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
import { Loader2, ImagePlus, X } from "lucide-react"
import { ProductFormProps, CategoryProps, UnitProps } from "../../type"

// validate UUID
const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

interface ProductFormDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSave: (formData: Partial<ProductFormProps> & { imageFile?: File | null }) => Promise<void>
  currentUserId: string
  categories: CategoryProps[]
  units: UnitProps[]
}

export default function ProductFormDialog({
  isOpen,
  setIsOpen,
  onSave,
  currentUserId,
  categories,
  units,
}: ProductFormDialogProps) {
  const [formData, setFormData] = useState<Partial<ProductFormProps> & { imageFile?: File | null }>({
    name: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    unitId: "",
    createdBy: currentUserId,
    imageFile: null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Reset form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        categoryId: "",
        unitId: "",
        createdBy: currentUserId,
        imageFile: null,
      })
      setImagePreview(null)
      setFileName("")
      setError("")
    }
  }, [isOpen, currentUserId])

  // Form field change handler
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file, imageUrl: "" }))
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError("")
    } else {
      setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: "" }))
      setImagePreview(null)
      setFileName("")
    }
  }

  // Remove image handler
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null, imageUrl: "" }))
    setImagePreview(null)
    setFileName("")
  }

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) {
      setError("Product name is required.")
      return
    }
    if (!formData.description?.trim()) {
      setError("Description is required.")
      return
    }
    if (!formData.imageFile) {
      setError("Image is required.")
      return
    }
    if (!formData.categoryId?.trim() || !isValidUUID(formData.categoryId)) {
      setError("Please select a valid category.")
      return
    }
    if (!formData.unitId?.trim() || !isValidUUID(formData.unitId)) {
      setError("Please select a valid unit.")
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      setIsLoading(false)
      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to save product. Please try again.")
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
            name: "",
            description: "",
            imageUrl: "",
            categoryId: "",
            unitId: "",
            createdBy: currentUserId,
            imageFile: null,
          })
          setImagePreview(null)
          setFileName("")
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
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image (upload only) *</Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="imageFile"
                className="flex items-center justify-center border border-dashed border-gray-400 rounded-md p-2 cursor-pointer hover:bg-gray-100"
              >
                <ImagePlus className="h-5 w-5 mr-2" />
                Choose Image
              </label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {fileName && <span className="text-sm text-gray-600 truncate max-w-[150px]">{fileName}</span>}
              {imagePreview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              value={formData.categoryId || ""}
              onValueChange={(val) => handleChange("categoryId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No categories available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitId">Unit *</Label>
            <Select
              value={formData.unitId || ""}
              onValueChange={(val) => handleChange("unitId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                {units.length > 0 ? (
                  units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No units available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
