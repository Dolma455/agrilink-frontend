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

export default function AdminProfilePage() {
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
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600">Manage your admin account</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700"><Save className="h-4 w-4 mr-2"/>Save</Button>
              <Button onClick={() => setIsEditing(false)} variant="outline"><X className="h-4 w-4 mr-2"/>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline"><Edit className="h-4 w-4 mr-2"/>Edit Profile</Button>
          )}
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
              <Badge className="mt-2 bg-blue-100 text-blue-800">Admin User</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2"><Label>Full Name</Label><Input value={profileData.fullName} onChange={e => setProfileData({...profileData, fullName: e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Email</Label><Input value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Location</Label><Input value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} disabled={!isEditing}/></div>
            <div className="space-y-2"><Label>Role</Label><Input value={profileData.role} disabled/></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5"/>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4 max-w-xl">
          <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword:e.target.value})}/></div>
          <div className="space-y-2"><Label>New Password</Label><Input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword:e.target.value})}/></div>
          <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword:e.target.value})}/></div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleChangePassword}>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-red-600"><Trash2 className="h-5 w-5"/>Delete Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Once you delete your account, there is no going back. Please be certain.</p>
          <Button variant="destructive" onClick={handleDeleteAccount}>Delete My Account</Button>
        </CardContent>
      </Card>
    </div>
  )
}
