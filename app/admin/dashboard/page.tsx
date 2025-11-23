"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { Users, Store, Package2, ShoppingCart, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"

interface AdminDashboardData {
  kpi: {
    totalFarmers: number
    totalVendors: number
    totalProducts: number
    totalOrders: number
  }
  topProducts: { productName: string; totalRevenue: number }[]
  orderStatusDistribution: { status: string; count: number }[]
  monthlyOrders: { month: string; ordersCount: number }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num)
  }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axiosInstance.get("/api/v1/dashboard/admin", {
          headers: { accept: "*/*" },
        })

        if (response.data.isSuccess && response.data.output) {
          setData(response.data.output)
        } else {
          throw new Error(response.data.message || "Failed to load admin dashboard")
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load admin dashboard"
        setError(msg)
        toast.error(msg)
        console.error("Admin Dashboard Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-12 flex items-center justify-center">
        <div className="text-lg font-medium">Loading admin dashboard...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-8 space-y-4">
            <p className="text-red-600 text-lg">{error || "No data available"}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { kpi, topProducts, orderStatusDistribution, monthlyOrders } = data

  const monthlyChartData = monthlyOrders.map(item => {
    const [month, year] = item.month.split("-")
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString("default", { month: "short" })
    return { month: `${monthName} ${year}`, orders: item.ordersCount }
  })

  const COLORS = ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444", "#ec4899"]

  const ordersConfig: ChartConfig = { orders: { label: "Orders", color: "hsl(221, 83%, 53%)" } }
  const productConfig: ChartConfig = { totalRevenue: { label: "Revenue", color: "hsl(142, 76%, 36%)" } }
  const statusConfig: ChartConfig = { count: { label: "Count", color: "hsl(260, 80%, 55%)" } }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and performance metrics</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/admin/user-management">
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Link>
        </Button>
      </div>

      {/* Gradient KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Farmers</CardTitle>
            <Users className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(kpi.totalFarmers)}</div>
            <p className="text-xs opacity-90 mt-1">Registered farmers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Vendors</CardTitle>
            <Store className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(kpi.totalVendors)}</div>
            <p className="text-xs opacity-90 mt-1">Active vendors</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Products</CardTitle>
            <Package2 className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(kpi.totalProducts)}</div>
            <p className="text-xs opacity-90 mt-1">Listed products</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Orders</CardTitle>
            <ShoppingCart className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(kpi.totalOrders)}</div>
            <p className="text-xs opacity-90 mt-1">All time orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Monthly Orders Trend */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Monthly Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ordersConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => formatNumber(v as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="var(--color-orders)" 
                    strokeWidth={4} 
                    dot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 5 Products */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Top 5 Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer config={productConfig} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={topProducts.slice(0, 5)} 
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
                    tick={{ fontSize: 12 }} 
                  />
                  <YAxis 
                    dataKey="productName" 
                    type="category" 
                    width={115} 
                    tick={{ fontSize: 11 }} 
                  />
                  <ChartTooltip 
                    formatter={(v) => formatCurrency(v as number)} 
                    content={<ChartTooltipContent />} 
                  />
                  <Bar dataKey="totalRevenue" fill="var(--color-totalRevenue)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Distribution and Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-bold">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer config={statusConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {orderStatusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(v) => formatNumber(v as number)} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Most Popular Product</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{topProducts[0]?.productName || "N/A"}</p>
              <p className="text-xs text-gray-500 mt-2">{formatCurrency(topProducts[0]?.totalRevenue || 0)}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Peak Month</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">
                {monthlyChartData.sort((a, b) => b.orders - a.orders)[0]?.month || "N/A"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {monthlyChartData.sort((a, b) => b.orders - a.orders)[0]?.orders || 0} orders
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-600">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {orderStatusDistribution.find(s => s.status === "Pending")?.count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}