"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { UnitProps } from "../../type"
import UnitsTable from "./UnitTable"
import UnitsFormDialog from "./UnitFormDialog"
import axiosInstance from "@/lib/axiosInstance"

export default function UnitsPage() {
  const [units, setUnits] = useState<UnitProps[]>([])
  const [unitLoading, setUnitLoading] = useState(true)
  const [unitError, setUnitError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<UnitProps | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch Units
  const fetchUnits = async () => {
    try {
      setUnitLoading(true)
      const response = await axiosInstance.get("/api/v1/unit/all")
      setUnits(response.data.output || [])
    } catch (err: any) {
      console.error("Fetch Units Error:", err)
      setUnitError(err.message || "Failed to load units")
    } finally {
      setUnitLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const filteredUnits = units.filter(
    (unit) =>
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Delete units
  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this unit?")) {
      try {
        setIsLoading(true)
        const response = await axiosInstance.delete(`/api/v1/unit/delete/${id}`)
        console.log("Delete success:", response.data)
        await fetchUnits()
        if (editingUnit?.id === id) {
          setIsDialogOpen(false)
          setEditingUnit(null)
        }
        alert("Unit deleted successfully")
      } catch (err: any) {
        console.error("Delete Error:", err)
        alert(err.message || "Failed to delete unit. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleEdit(unit: UnitProps) {
    setEditingUnit(unit)
    setIsDialogOpen(true)
  }

  function handleAddNew() {
    setEditingUnit(null)
    setIsDialogOpen(true)
  }

  // Create / Update units
  async function handleSave(formData: Partial<UnitProps>) {
    const payload = {
      name: formData.name!,
      symbol: formData.symbol!,
    }

    try {
      if (editingUnit) {
        // UPDATE
        await axiosInstance.put("/api/v1/unit/update", {
          id: editingUnit.id,
          ...payload,
        })
      } else {
        // CREATE
        await axiosInstance.post("/api/v1/unit/create", payload)
      }

      await fetchUnits()
      alert(editingUnit ? "Unit updated successfully" : "Unit added successfully")
      setIsDialogOpen(false)
      setEditingUnit(null)
    } catch (err: any) {
      console.error("Save Unit Error:", err)
      alert(err.message || "Failed to save unit")
    }
  }

  if (unitLoading) return <p>Loading units...</p>
  if (unitError) return <p>Error loading units: {unitError}</p>

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Unit Management</h1>
            <p className="text-muted-foreground">Admin view: Manage measurement units</p>
          </div>
          <Button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4" />
            Add Unit
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
                placeholder="Search by name or symbol..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <UnitsTable
          units={filteredUnits}
          isLoading={isLoading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />

        <UnitsFormDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          editingUnit={editingUnit}
          setEditingUnit={setEditingUnit}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
