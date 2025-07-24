import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogFooter,} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ShoppingCart, Sprout } from "lucide-react"
import { UserProps } from "./type"

interface UserFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editingUser: UserProps | null;
  setEditingUser: (user: UserProps | null) => void;
  onSave: (formData: Partial<UserProps> & { password?: string; confirmPassword?: string; profilePicture?: File | null }) => Promise<void>;
}

export default function UserFormDialog({ isOpen, setIsOpen, editingUser, setEditingUser, onSave }: UserFormDialogProps) {
  const [formData, setFormData] = useState<Partial<UserProps> & { password?: string; confirmPassword?: string; profilePicture?: File | null }>({
    role: editingUser?.role || "Farmer",
    fullName: editingUser?.fullName || "",
    email: editingUser?.email || "",
    phone: editingUser?.phone || "",
    businessName: editingUser?.businessName || "",
    location: editingUser?.location || "",
    profilePicture: null,
    password: "",
    confirmPassword: "",
  })
  const [fileName, setFileName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: keyof typeof formData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "profilePicture" && value instanceof File) {
      setFileName(value.name)
    } else if (field === "profilePicture" && !value) {
      setFileName("")
    }
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.fullName?.trim() ||
      !formData.email?.trim() ||
      !formData.phone?.trim() ||
      !formData.businessName?.trim() ||
      !formData.location?.trim() ||
      !formData.role?.trim()
    ) {
      setError("Please fill in all required fields")
      return
    }

    // Validate profile picture
    if (!editingUser && !formData.profilePicture) {
      setError("Profile picture is required for new users")
      return
    }
    if (formData.profilePicture && !["image/jpeg", "image/png","image/jpg"].includes(formData.profilePicture.type)) {
      setError("Profile picture must be a JPEG or PNG image")
      return
    }

    // Validate password for add operation
    if (!editingUser) {
      if (!formData.password || !formData.confirmPassword) {
        setError("Password and Confirm Password are required for new users")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
        setError("Password must be at least 8 characters long and include a letter, number, and special character")
        return
      }
    }

    setIsLoading(true)
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save user. Please check the input data, including the image format (JPEG/PNG) and size.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        setEditingUser(null)
        setFormData({
          role: "Farmer",
          fullName: "",
          email: "",
          phone: "",
          businessName: "",
          location: "",
          profilePicture: null,
          password: "",
          confirmPassword: "",
        })
        setFileName("")
        setShowPassword(false)
        setShowConfirmPassword(false)
        setError("")
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>User Type *</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Farmer" id="farmer" />
                <Label htmlFor="farmer" className="flex items-center gap-2 cursor-pointer">
                  <Sprout className="h-4 w-4 text-green-600" />
                  Farmer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Vendor" id="vendor" />
                <Label htmlFor="vendor" className="flex items-center gap-2 cursor-pointer">
                  <ShoppingCart className="h-4 w-4 text-orange-600" />
                  Vendor
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessName">{formData.role === "Farmer" ? "Farm Name *" : "Business Name *"}</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePicture">Profile Picture {editingUser ? "(Optional)" : "*"}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="profilePicture"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(e) => handleChange("profilePicture", e.target.files ? e.target.files[0] : null)}
                required={!editingUser}
                className="flex-1"
              />
              {fileName && (
                <span className="text-sm text-gray-600 truncate max-w-[150px]">{fileName}</span>
              )}
            </div>
          </div>
          {!editingUser && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pr-10"
                    required
                  /> 
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="pr-10"
                    required
                  />

                </div>
              </div>
            </>
          )}
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
                  {editingUser ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingUser ? "Update User" : "Add User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
