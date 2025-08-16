"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2, Sprout, ShoppingCart } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "Farmer",
    businessName: "",
    location: "",
    agreeTerms: false,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.businessName.trim() ||
      !formData.location.trim() ||
      !formData.userType.trim()
    ) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    // Validate password
    if (!formData.password || !formData.confirmPassword) {
      setError("Password and Confirm Password are required")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      setError("Password must be at least 8 characters long and include a letter, number, and special character")
      setIsLoading(false)
      return
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError("You must agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    // Prepare FormData payload
    const payload = new FormData()
    payload.append("FullName", `${formData.firstName} ${formData.lastName}`)
    payload.append("Email", formData.email)
    payload.append("Phone", formData.phone)
    payload.append("BusinessName", formData.businessName)
    payload.append("Location", formData.location)
    payload.append("Role", formData.userType.charAt(0).toUpperCase() + formData.userType.slice(1)) // Capitalize role to match API (Farmer/Vendor)
    payload.append("Password", formData.password)

    try {
      await axiosInstance.post("/api/v1/user/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Store user type and name in localStorage
      localStorage.setItem("userType", formData.userType)
      localStorage.setItem("userName", `${formData.firstName} ${formData.lastName}`)

      // Redirect based on user type
      if (formData.userType === "farmer") {
        router.push("/farmer/dashboard")
      } else if (formData.userType === "vendor") {
        router.push("/vendor/dashboard")
      } else {
        router.push("/admin/dashboard")
      }
    } catch (err: any) {
      console.error("Signup Error:", err)
      setError(err.response?.data?.message || "Failed to create account. Please check your input data.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                <Sprout className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AgriLink</h1>
                <p className="text-green-600 font-medium">Farm Management Platform</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join thousands of farmers and vendors connecting through our agricultural marketplace.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">300+</div>
              <div className="text-sm text-gray-600">Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1000+</div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Sprout className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join AgriLink and start connecting today</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label>I am a</Label>
                  <RadioGroup
                    value={formData.userType}
                    onValueChange={(value) => handleChange("userType", value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farmer" id="farmer" />
                      <Label htmlFor="farmer" className="flex items-center gap-2 cursor-pointer">
                        <Sprout className="h-4 w-4 text-green-600" />
                        Farmer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingCart className="h-4 w-4 text-orange-600" />
                        Vendor
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter First Name"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="phone"
                    placeholder="+977 9800000000"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>

                {/* Business Information */}
                <div className="space-y-2">
                  <Label htmlFor="businessName">{formData.userType === "farmer" ? "Farm Name" : "Business Name"}</Label>
                  <Input
                    id="businessName"
                    placeholder={formData.userType === "farmer" ? "Green Valley Farm" : "Fresh Mart Store"}
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      required
                      className="pr-10"
                    />
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleChange("agreeTerms", checked)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-green-600 hover:text-green-700">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading || !formData.agreeTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}