"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Package, ShoppingCart, AlertTriangle, Plus, Eye, DollarSign } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"

interface DashboardData {
  kpi: {
    totalRevenue: number
    totalOrders: number
    pendingOrders: number
    activeProducts: number
  }
  topProducts: { productName: string; totalRevenue: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  orderStatusDistribution: { status: string; count: number }[]
}

export default function FarmerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [farmerId, setFarmerId] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get farmer ID from localStorage or use fallback
  useEffect(() => {
    const id = typeof window !== "undefined" 
      ? localStorage.getItem("farmerId") || "0199059c-3844-72c5-8074-4c095d5b8685"
      : "0199059c-3844-72c5-8074-4c095d5b8685"
    setFarmerId(id)
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!farmerId) return

      try {
        setLoading(true)
        setError(null)

        const response = await axiosInstance.get(`/api/v1/dashboard/farmer/${farmerId}`)
        if (response.data.isSuccess) {
          setData(response.data.output)
        } else {
          throw new Error(response.data.message || "Failed to load dashboard")
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Failed to load dashboard"
        setError(msg)
        console.error("Dashboard fetch error:", msg)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [farmerId])

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>
  if (!data) return <div className="p-8 text-center text-red-600">Failed to load data</div>

  const { kpi, topProducts, monthlyRevenue, orderStatusDistribution } = data
  const avgOrderValue = kpi.totalOrders > 0 ? Math.round(kpi.totalRevenue / kpi.totalOrders) : 0

  const monthlyChartData = monthlyRevenue.map(item => {
    // Parse "01-2025" format to get month and year
    const [month, year] = item.month.split("-")
    const monthIndex = parseInt(month) - 1
    const monthName = new Date(2025, monthIndex).toLocaleString("default", { month: "short" })
    return {
      month: `${monthName} ${year}`,
      revenue: item.revenue,
    }
  })

  const COLORS = ["#f97316", "#10b981", "#3b82f6", "#22c55e", "#6366f1", "#ef4444"]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your farm.</p>
        </div>
        <div className="flex gap-2">
      
          <Button variant="outline" asChild>
            <Link href="/farmer/orders">
              <Eye className="h-4 w-4 mr-2" />
              View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Gradient KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpi.totalRevenue)}</div>
            <p className="text-xs opacity-90">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpi.totalOrders}</div>
            <p className="text-xs opacity-90">Completed orders</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertTriangle className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpi.pendingOrders}</div>
            <p className="text-xs opacity-90">Need your attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <Package className="h-5 w-5 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(avgOrderValue)}</div>
            <p className="text-xs opacity-90">Per completed order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer config={{ revenue: { label: "Revenue", color: "#10b981" } }} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <ChartTooltip formatter={(value: number) => formatCurrency(value)} content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 5 Products */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Top 5 Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer config={{ revenue: { label: "Revenue", color: "#3b82f6" } }} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={topProducts.slice(0, 5)} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <YAxis 
                    dataKey="productName" 
                    type="category" 
                    width={115} 
                    tick={{ fontSize: 11 }} 
                  />
                  <ChartTooltip formatter={(value: number) => formatCurrency(value)} content={<ChartTooltipContent />} />
                  <Bar dataKey="totalRevenue" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer className="h-[280px] w-full" config={{ count: { label: "Count", color: "#6366f1" } }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }: { status: string; count: number }) => `${status}: ${count}`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {orderStatusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Summary section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Best Product</span>
              <span className="text-sm font-bold text-green-600">{topProducts[0]?.productName || "N/A"}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Active Products</span>
              <span className="text-sm font-bold text-blue-600">{kpi.activeProducts}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Peak Month</span>
              <span className="text-sm font-bold text-orange-600">
                {(() => {
                  const sorted = [...monthlyChartData].sort((a, b) => b.revenue - a.revenue)
                  return sorted[0]?.month || "N/A"
                })()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}