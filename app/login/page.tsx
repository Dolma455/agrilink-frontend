
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Loader2, Sprout, Users, Truck, BarChart3, ShoppingCart, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "farmer",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false)
      // Store user type in localStorage for demo
      localStorage.setItem("userType", formData.userType)
      localStorage.setItem("userName", "Demo User")

      // Redirect based on user type
      if (formData.userType === "farmer") {
        router.push("/farmer/dashboard")
      }
      else if(formData.userType === "admin") {
        router.push("/admin/dashboard")
      }
      else {
        router.push("/vendor/dashboard")
      }
    }, 1500)
  }
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
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
              Connect, manage, and grow your agricultural business with our comprehensive platform.
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
              <div className="text-sm text-gray-600">Orders Processed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center">
                  <Sprout className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to your AgriLink account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-3">
                  <Label>Login as</Label>
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
                      <div className="flex items-center space-x-2">
                      <RadioGroupItem value="admin" id="admin" />
                      <Label htmlFor="admin" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4 text-green-600" />
                        Admin
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleChange("rememberMe", checked)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="px-0 text-green-600 hover:text-green-700">
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                  Sign Up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}