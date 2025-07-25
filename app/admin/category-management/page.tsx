"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { CategoryProps } from "../../type"
import axiosInstance from "@/lib/axiosInstance"
import CategoriesTable from "./CategoryTable"
import CategoriesFormDialog from "./CategoryFormDialog"

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryProps[]>([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true)
      const response = await axiosInstance.get("/api/v1/category/all")
      setCategories(response.data.output || [])
    } catch (err: any) {
      console.error("Fetch Categories Error:", err)
      setCategoryError(err.message || "Failed to load categories")
    } finally {
      setCategoryLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Delete categories
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        setIsLoading(true)
        const response = await axiosInstance.delete(`/api/v1/category/delete/${id}`)
        console.log("Delete success:", response.data)
        await fetchCategories()
        if (editingCategory?.id === id) {
          setIsDialogOpen(false)
          setEditingCategory(null)
        }
        alert("Category deleted successfully")
      } catch (err: any) {
        console.error("Delete Error:", err)
        alert(err.message || "Failed to delete category. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleEdit(category: CategoryProps) {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  function handleAddNew() {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  // Create / Update categories
  async function handleSave(formData: Partial<CategoryProps>) {
    const payload = {
      name: formData.name!,
      description: formData.description!,
    }

    try {
      if (editingCategory) {
        // UPDATE
        await axiosInstance.put("/api/v1/category/update", {
          id: editingCategory.id,
          ...payload,
        })
      } else {
        // CREATE
        await axiosInstance.post("/api/v1/category/create", payload)
      }

      await fetchCategories()
      alert(editingCategory ? "Category updated successfully" : "Category added successfully")
      setIsDialogOpen(false)
      setEditingCategory(null)
    } catch (err: any) {
      console.error("Save Category Error:", err)
      alert(err.message || "Failed to save category")
    }
  }

  if (categoryLoading) return <p>Loading categories...</p>
  if (categoryError) return <p>Error loading categories: {categoryError}</p>

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
            <p className="text-muted-foreground">Admin View: Manage Categories</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <Card>
          <CardContent>
            <div className="relative max-w-sm pt-4">
              <Search className="absolute left-3 top-7 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <CategoriesTable
          categories={filteredCategories}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <CategoriesFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingCategory={editingCategory}
          setEditingCategory={setEditingCategory}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
