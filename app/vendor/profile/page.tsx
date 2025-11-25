"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Lock, Trash2 } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UserProps } from "@/app/type"

export default function VendorProfilePage() {
  const [profileData, setProfileData] = useState<UserProps | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null
  if (!userId) router.push("/login")

  const fetchProfile = async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(`/api/v1/user/${userId}`)
      if (response.data.isSuccess) setProfileData(response.data.output)
      else setError(response.data.message || "Failed to fetch profile")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to fetch profile")
      toast.error(err.message || "Failed to fetch profile")
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchProfile() }, [])

  const handleSave = async () => { setIsEditing(false); toast.success("Profile saved!") }
  const handleChangePassword = async () => { setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); toast.success("Password updated!") }
  const handleDeleteAccount = async () => { if (confirm("Delete account?")) toast.success("Account deleted!") }

  if (loading) return <p className="p-6">Loading profile...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!profileData) return null

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600">Manage your vendor details</p>
        </div>
        
      </div>

      <Card>
        <CardHeader><CardTitle>Profile Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              {profileData.profilePicture ? <AvatarImage src={profileData.profilePicture} /> : <AvatarFallback>{profileData.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>}
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profileData.fullName}</h3>
              <p className="text-gray-600">{profileData.businessName}</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">Verified Vendor</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2"><Label>Full Name</Label><Input value={profileData.fullName} onChange={e => setProfileData({...profileData, fullName:e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Email</Label><Input value={profileData.email} onChange={e => setProfileData({...profileData, email:e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={profileData.phone} onChange={e => setProfileData({...profileData, phone:e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Location</Label><Input value={profileData.location} onChange={e => setProfileData({...profileData, location:e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Business Name</Label><Input value={profileData.businessName} onChange={e => setProfileData({...profileData, businessName:e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Role</Label><Input value={profileData.role} disabled/></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
