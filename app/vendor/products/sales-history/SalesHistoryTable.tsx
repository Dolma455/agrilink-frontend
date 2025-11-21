"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"

type Props = {
  refreshKey?: number
}

const getVendorId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId") || process.env.NEXT_PUBLIC_VENDOR_ID || ""
  }
  return ""
}

export default function SalesHistoryTable({ refreshKey = 0 }: Props) {
    const vendorId = getVendorId()
    const router = useRouter()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch] = useDebounce(searchTerm, 400)
    const [rows, setRows] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(false)

    // fetch products for filter
    useEffect(() => {
        if (!vendorId) return
        axiosInstance
            .get(`/api/inventory/vendor/${vendorId}`)
            .then((res) => setProducts(res.data?.data || []))
            .catch(() => {})
    }, [vendorId])

    // fetch sales
    const fetchSales = async () => {
        if (!vendorId) return
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append("page", String(page))
            params.append("pageSize", String(pageSize))
            if (debouncedSearch) params.append("search", debouncedSearch)

            const res = await axiosInstance.get(`/api/inventory/vendor/${vendorId}/sales-history?${params.toString()}`)
            setRows(res.data?.data || [])
            setTotalCount(res.data?.totalCount || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSales()
    }, [vendorId, page, pageSize, debouncedSearch, refreshKey])

    if (!vendorId) {
        return (
            <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8">
                <p className="text-red-500">User not logged in. Please log in to view sales history.</p>
                <Button variant="outline" onClick={() => router.push("/login")} className="mt-4">
                    Go to Login
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-end flex-wrap">
                <Input
                    placeholder="Global Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Quantity Sold</TableHead>
                        <TableHead>Price per Unit</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Sold At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7}>Loading...</TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7}>No records found.</TableCell>
                        </TableRow>
                    ) : (
                        rows.map((r: any) => (
                            <TableRow key={r.saleId}>
                                <TableCell>{r.productName}</TableCell>
                                <TableCell>{r.categoryName}</TableCell>
                                <TableCell>{r.unitName}</TableCell>
                                <TableCell>{r.quantitySold}</TableCell>
                                <TableCell>{r.pricePerUnit}</TableCell>
                                <TableCell>{r.totalAmount}</TableCell>
                                <TableCell>{new Date(r.soldAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-2">
                <div className="text-sm">Total: {totalCount}</div>
                <div className="flex items-center gap-2">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                    <div className="px-2">{page}</div>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            </div>
        </div>
    )
}

function useDebounce<T>(value: T, delay = 300): [T] {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return [debouncedValue]
}

