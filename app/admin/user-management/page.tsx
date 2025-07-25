"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { UserProps } from "../../type"
import UserTable from "./UserTable"
import UserFormDialog from "./UserFormDialog"
import axiosInstance from "@/lib/axiosInstance"

export default function Dashboard() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"Farmer" | "Vendor">("Farmer")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setUserLoading(true)
      const response = await axiosInstance.get("/api/v1/user/all")
      setUsers(response.data.data || [])
    } catch (err: any) {
      console.error("Fetch Users Error:", err)
      setUserError(err.message || "Failed to load users")
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users by role and search term
  const filteredUsers = users.filter(
    (user) =>
      user.role === activeTab &&
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm))
  )

  // Delete user
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        setIsLoading(true)
        await axiosInstance.delete(`/api/v1/user/${id}`)
        await fetchUsers()
        if (editingUser?.id === id) {
          setIsDialogOpen(false)
          setEditingUser(null)
        }
        alert("User deleted successfully")
      } catch (err: any) {
        console.error("Delete Error:", err)
        alert(err.message || "Failed to delete user. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleEdit(user: UserProps) {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  function handleAddNew() {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  // Create / Update user
  async function handleSave(formData: Partial<UserProps> & { password?: string; profilePicture?: File | null }) {
    const payload = new FormData()
    payload.append("FullName", formData.fullName!)
    payload.append("Email", formData.email!)
    payload.append("Phone", formData.phone!)
    payload.append("BusinessName", formData.businessName!)
    payload.append("Location", formData.location!)
    payload.append("Role", formData.role!)
    if (formData.profilePicture) {
      payload.append("ProfilePicture", formData.profilePicture)
    }

    try {
      if (editingUser) {
        // UPDATE
        payload.append("Id", editingUser.id)
        await axiosInstance.patch("/api/v1/user/update", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        // CREATE
        payload.append("Password", formData.password!)
        await axiosInstance.post("/api/v1/user/register", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      await fetchUsers()
      alert(editingUser ? "User updated successfully" : "User added successfully")
      setIsDialogOpen(false)
      setEditingUser(null)
    } catch (err: any) {
      console.error("Save User Error:", err)
      alert(err.message || "Failed to save user")
    }
  }

  if (userLoading) return <p>Loading users...</p>
  if (userError) return <p>Error loading users: {userError}</p>

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Admin view: Manage Farmers and Vendors</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4">
          {(["Farmer", "Vendor"] as const).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}s
            </button>
          ))}
        </div>

        {/* Search */}
        <Card>
          <CardContent>
            <div className="relative max-w-sm pt-4">
              <Search className="absolute left-3 top-7 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Table */}
        <UserTable
          users={filteredUsers}
          activeTab={activeTab}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        {/* Add/Edit User Dialog */}
        <UserFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
