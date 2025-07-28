
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { UnitProps } from "../../type"

interface UnitsFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingUnit: UnitProps | null;
  setEditingUnit: (unit: UnitProps | null) => void;
  onSave: (formData: Partial<UnitProps>) => Promise<void>;
}

export default function UnitsFormDialog({ isOpen, setIsOpen, editingUnit, setEditingUnit, onSave }: UnitsFormDialogProps) {
  const [formData, setFormData] = useState<Partial<UnitProps>>({
    name: "",
    symbol: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Sync formData with editingUnit when it changes
  useEffect(() => {
    if (editingUnit) {
      setFormData({
        name: editingUnit.name || "",
        symbol: editingUnit.symbol || "",
      })
      setError("")
    } else if (isOpen) {
      setFormData({
        name: "",
        symbol: "",
      })
      setError("")
    }
  }, [editingUnit, isOpen])

  const handleChange = (field: keyof UnitProps, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim() || !formData.symbol?.trim()) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      setIsLoading(false)
      setIsOpen(false)
      setEditingUnit(null)
    } catch (err: any) {
      setError(err.message || "Failed to save unit. Please check the input data.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          setEditingUnit(null)
          setFormData({
            name: "",
            symbol: "",
          })
          setError("")
          setIsLoading(false)
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingUnit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
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
            <Label htmlFor="symbol">Symbol *</Label>
            <Input
              id="symbol"
              value={formData.symbol}
              onChange={(e) => handleChange("symbol", e.target.value)}
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
                  {editingUnit ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingUnit ? "Update Unit" : "Add Unit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
