import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog,DialogContent, DialogHeader, DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { CategoryProps} from "../../type"

interface CategoryFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingCategory: CategoryProps | null;
  setEditingCategory: (unit: CategoryProps | null) => void;
  onSave: (formData: Partial<CategoryProps>) => Promise<void>;
}

export default function CategoriesFormDialog({ isOpen, setIsOpen, editingCategory, setEditingCategory, onSave }: CategoryFormDialogProps) {
  const [formData, setFormData] = useState<Partial<CategoryProps>>({
    name: editingCategory?.name || "",
    description: editingCategory?.description || "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof CategoryProps, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim() || !formData.description?.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save category. Please check the input data.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setEditingCategory(null)
        setFormData({
          name: "",
          description: "",
        })
        setError("")
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
                  {editingCategory ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingCategory ? "Update Category" : "Add Category"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
