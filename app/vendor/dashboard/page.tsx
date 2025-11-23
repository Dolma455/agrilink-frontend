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
import { DollarSign, ShoppingCart, TrendingUp, Package, Plus, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "sonner"

interface VendorDashboardData {
  kpi: {
    totalPurchases: number
    totalSales: number
    pendingPurchaseOrders: number
    netProfit: number
  }
  topProducts: { productName: string; totalRevenue: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  purchaseVsSale: { label: string; amount: number }[]
}

export default function VendorDashboard() {
  const [data, setData] = useState<VendorDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const vendorId = typeof window !== "undefined" ? localStorage.getItem("userId") : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  useEffect(() => {
    if (!vendorId) {
      setError("Please log in to view your dashboard")
      setLoading(false)
      return
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axiosInstance.get(`/api/v1/dashboard/vendor/${vendorId}`)
        if (response.data.isSuccess) {
          setData(response.data.output)
        } else {
          throw new Error(response.data.message || "Failed to load dashboard")
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Failed to load dashboard"
        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [vendorId])

  if (loading) return <div className="p-12 text-center text-lg">Loading your dashboard...</div>
  if (error || !data) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-600 text-lg">{error || "No data available"}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const { kpi, topProducts, monthlyRevenue, purchaseVsSale } = data
  const profitMargin = kpi.totalSales > 0 ? Math.round((kpi.netProfit / kpi.totalSales) * 100) : 0

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

  // Chart configs (required for Tooltip/Legend to work without errors)
  const monthlyConfig: ChartConfig = {
    revenue: { label: "Revenue", color: "hsl(142, 76%, 36%)" },
  }

  const topProductsConfig: ChartConfig = {
    totalRevenue: { label: "Revenue", color: "hsl(260, 80%, 55%)" },
  }

  const purchaseSaleConfig: ChartConfig = {
    amount: { label: "Amount", color: "hsl(142, 76%, 36%)" },
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Your sales, purchases & profit at a glance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/vendor/orders">
              <Eye className="h-4 w-4 mr-2" /> View Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* Gradient KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Sales</CardTitle>
            <DollarSign className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpi.totalSales)}</div>
            <p className="text-xs opacity-90 mt-1">Revenue from customers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Total Purchases</CardTitle>
            <ShoppingCart className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpi.totalPurchases)}</div>
            <p className="text-xs opacity-90 mt-1">Spent on farmers</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Net Profit</CardTitle>
            <TrendingUp className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpi.netProfit)}</div>
            <p className="text-xs opacity-90 mt-1">After expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Pending Orders</CardTitle>
            <Package className="h-6 w-6 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpi.pendingPurchaseOrders}</div>
            <p className="text-xs opacity-90 mt-1">Awaiting delivery</p>
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

        {/* Top 5 Products - Horizontal Bar Chart */}
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
                    tick={{ fontSize: 12 }}
                    width={120}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip formatter={(value: number) => formatCurrency(value)} content={<ChartTooltipContent />} />
                  <Bar dataKey="totalRevenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Purchase vs Sales Comparison - Donut Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Purchase vs Sales Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ChartContainer config={{ amount: { label: "Amount", color: "#6366f1" } }} className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={purchaseVsSale}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ label, amount }: { label: string; amount: number }) => `${label}: ${formatCurrency(amount)}`}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {purchaseVsSale.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(value: number) => formatCurrency(value)} content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Quick Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Top Product</span>
              <span className="text-sm font-bold text-green-600">{topProducts[0]?.productName || "N/A"}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Profit Margin</span>
              <span className="text-sm font-bold text-blue-600">{profitMargin}%</span>
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