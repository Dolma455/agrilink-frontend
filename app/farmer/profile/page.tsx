"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Lock, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function FarmerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Ram Bahadur Thapa",
    email: "ram.thapa@email.com",
    phone: "+977-9841234567",
    location: "Chitwan, Nepal",
    farmName: "Green Valley Farm",
    joinedDate: "March 2022",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSave = () => {
    setIsEditing(false)
    console.log("Saving profile data:", profileData)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    console.log("Changing password:", passwordData)
    // Reset fields
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?")
    if (confirmDelete) {
      console.log("Deleting account...")
      // delete logic here
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your farmer profile</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-2xl">
                {profileData.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.farmName}</p>
              <Badge className="mt-2 bg-green-100 text-green-800">Verified Farmer</Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Farm Name</Label>
              <Input
                value={profileData.farmName}
                onChange={(e) => setProfileData({ ...profileData, farmName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Joined Date</Label>
              <Input value={profileData.joinedDate} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleChangePassword}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
