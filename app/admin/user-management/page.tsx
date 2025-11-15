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
  const [users, setUsers] = useState<UserProps[]>([]) // paginated from backend
  const [allUsers, setAllUsers] = useState<UserProps[]>([]) // full list for global search
  const [userLoading, setUserLoading] = useState(true)
  const [userError, setUserError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"Farmer" | "Vendor">("Farmer")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch paginated users (default behavior / for browsing)
  const fetchUsers = async (page: number = 1, size: number = 10) => {
    try {
      setUserLoading(true)
      setUserError(null)
      const response = await axiosInstance.get(`/api/v1/user/all?page=${page}&pageSize=${size}`)
      // Accept either response.data.data or response.data.output (your code uses both)
      const pageData = response.data.data || response.data.output || []
      setUsers(pageData)
      setTotalPages(response.data.totalPages || 1)
      setCurrentPage(response.data.currentPage || page)
      setPageSize(response.data.pageSize || size)
    } catch (err: any) {
      console.error("Fetch Users Error:", err)
      setUserError(err?.response?.data?.message || err.message || "Failed to load users")
    } finally {
      setUserLoading(false)
    }
  }

  // Fetch all users for global search (iterates pages)
  const fetchAllUsers = async (pageSizeFetch: number = 200) => {
    try {
      const all: UserProps[] = []
      let page = 1
      let totalPagesLocal = 1

      do {
        // use a large pageSize to reduce round-trips, but loop defensively
        const resp = await axiosInstance.get(`/api/v1/user/all?page=${page}&pageSize=${pageSizeFetch}`)
        const pageData: UserProps[] = resp.data.data || resp.data.output || []
        all.push(...pageData)
        totalPagesLocal = resp.data.totalPages || 1
        page += 1
      } while (page <= totalPagesLocal)

      // dedupe by id (defensive)
      const deduped = Array.from(new Map(all.map((u) => [u.id, u])).values())
      setAllUsers(deduped)
    } catch (err: any) {
      console.error("Fetch All Users Error:", err)
      // Don't block page browsing when global fetch fails — show a console error
    }
  }

  useEffect(() => {
    fetchUsers(currentPage, pageSize)
    fetchAllUsers()
  }, [currentPage, pageSize])

  const sourceForFiltering = searchTerm.trim() !== "" ? allUsers : users

  const filteredUsers = sourceForFiltering.filter((user) => {
    // Role filter
    const roleMatch = user.role === activeTab

    // Search match: check name, email, phone (case-insensitive)
    const q = searchTerm.trim().toLowerCase()
    const searchMatch =
      q === "" ||
      (user.fullName && user.fullName.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.phone && user.phone.includes(q))

    return roleMatch && searchMatch
  })

  const paginatedUsers = (() => {
    if (searchTerm.trim() === "") {
      // backend already paginated `users`; ensure we return the array directly
      return filteredUsers
    }
    // client-side paginate the filtered `allUsers`
    const start = (currentPage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  })()

  // total pages should reflect filtered count when searching, otherwise backend totalPages
  const totalFilteredPages =
    searchTerm.trim() === "" ? totalPages : Math.max(1, Math.ceil(filteredUsers.length / pageSize))

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalFilteredPages) {
      setCurrentPage(newPage)
    }
  }
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      setIsLoading(true)
      await axiosInstance.delete(`/api/v1/user/${id}`)
      // refresh both lists
      await fetchUsers(currentPage, pageSize)
      await fetchAllUsers()
      if (editingUser?.id === id) {
        setIsDialogOpen(false)
        setEditingUser(null)
      }
      alert("User deleted successfully")
    } catch (err: any) {
      console.error("Delete Error:", err)
      alert(err?.response?.data?.message || err.message || "Failed to delete user. Please try again.")
    } finally {
      setIsLoading(false)
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

  async function handleSave(formData: Partial<UserProps> & { password?: string; profilePicture?: File | null }) {
    const payload = new FormData()
    payload.append("FullName", formData.fullName || "")
    payload.append("Email", formData.email || "")
    payload.append("Phone", formData.phone || "")
    payload.append("BusinessName", formData.businessName || "")
    payload.append("Location", formData.location || "")
    payload.append("Role", formData.role || "")
    if (formData.profilePicture) {
      payload.append("ProfilePicture", formData.profilePicture)
    }

    try {
      if (editingUser) {
        payload.append("Id", editingUser.id)
        await axiosInstance.patch("/api/v1/user/update", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        payload.append("Password", formData.password || "")
        await axiosInstance.post("/api/v1/user/register", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      // refresh both lists
      await fetchUsers(currentPage, pageSize)
      await fetchAllUsers()

      alert(editingUser ? "User updated successfully" : "User added successfully")
      setIsDialogOpen(false)
      setEditingUser(null)
    } catch (err: any) {
      console.error("Save User Error:", err)
      alert(err?.response?.data?.message || err.message || "Failed to save user")
    }
  }

  // -------------------------
  // Render
  // -------------------------
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
                activeTab === tab ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => {
                setActiveTab(tab)
                setCurrentPage(1) // reset pagination when switching tabs
              }}
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
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // reset to first page when searching
                }}
                placeholder="Search by name, email or phone..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* User Table */}
        <UserTable
          users={paginatedUsers}
          activeTab={activeTab}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalFilteredPages}
          onPageChange={handlePageChange}
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
