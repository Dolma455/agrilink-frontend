"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import axiosML from "@/lib/axiosML"

// Dummy revenue data
const revenueData = [
  { period: "Jul 2023", actual: 18500, predicted: null },
  { period: "Aug 2023", actual: 21200, predicted: null },
  { period: "Sep 2023", actual: 24800, predicted: null },
  { period: "Oct 2023", actual: 28200, predicted: null },
  { period: "Nov 2023", actual: 32100, predicted: null },
  { period: "Dec 2023", actual: 35600, predicted: null },
  { period: "Jan 2024", actual: 39200, predicted: 38800 },
  { period: "Feb 2024", actual: null, predicted: 42500 },
  { period: "Mar 2024", actual: null, predicted: 46200 },
]

export default function FarmerReports() {
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [selectedProductPrice, setSelectedProductPrice] = useState<string>("")
  const [selectedProductDemand, setSelectedProductDemand] = useState<string>("")
  const [priceData, setPriceData] = useState<any[]>([])
  const [demandData, setDemandData] = useState<any[]>([])
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [loadingDemand, setLoadingDemand] = useState(false)
  const [productNamePrice, setProductNamePrice] = useState("Product")
  const [productNameDemand, setProductNameDemand] = useState("Product")
  const [currentMonthPrice, setCurrentMonthPrice] = useState("Now")
  const [currentMonthDemand, setCurrentMonthDemand] = useState("Now")
  const [errorPrice, setErrorPrice] = useState<string | null>(null)
  const [errorDemand, setErrorDemand] = useState<string | null>(null)

  // Format: "2025-11-01" → "Nov 2025"
  const fmt = (d: string) =>
    new Date(d).toLocaleString("default", { month: "short", year: "numeric" })

  // Fetch all products
  const fetchProducts = async () => {
    try {
      let all: any[] = []
      let page = 1
      while (true) {
        const res = await axiosInstance.get(`/api/v1/product/all?page=${page}`)
        if (!res.data.isSuccess || !res.data.data.length) break
        all = [...all, ...res.data.data]
        page++
      }
      const mapped = all.map((p: any) => ({ id: p.id, name: p.name }))
      setProducts(mapped)
      if (mapped[0]) {
        setSelectedProductPrice(mapped[0].id)
        setSelectedProductDemand(mapped[0].id)
      }
    } catch (err: any) {
      console.error("Failed to load products:", err)
      setErrorPrice("Failed to load products")
      setErrorDemand("Failed to load products")
    }
  }

  // Fetch ML predictions for a product
  const fetchPredictions = async (productId: string, type: "price" | "demand") => {
    if (!productId) return

    const setLoading = type === "price" ? setLoadingPrice : setLoadingDemand
    const setError = type === "price" ? setErrorPrice : setErrorDemand
    const setData = type === "price" ? setPriceData : setDemandData
    const setProductName = type === "price" ? setProductNamePrice : setProductNameDemand
    const setCurrentMonth = type === "price" ? setCurrentMonthPrice : setCurrentMonthDemand

    setLoading(true)
    setError(null)
    setData([])

    try {
      const res = await axiosML.post("/predict", { product_id: productId, months: 6 })
      const { product_name = "Product", lookback_end, predictions = [] } = res.data

      if (!lookback_end || predictions.length === 0) {
        throw new Error("No prediction data returned")
      }

      setProductName(product_name)
      setCurrentMonth(fmt(lookback_end))

      const chartData = predictions.map((p: any) => ({
        period: fmt(p.ds),
        predicted: Math.round(
          (type === "price" ? p.yhat_price : p.yhat_quantity) * 100
        ) / 100,
      }))

      setData(chartData)
    } catch (err: any) {
      console.error(`Prediction API failed (${type}):`, err)
      setError(err?.message || `Failed to fetch ${type} predictions`)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedProductPrice) fetchPredictions(selectedProductPrice, "price")
  }, [selectedProductPrice])

  useEffect(() => {
    if (selectedProductDemand) fetchPredictions(selectedProductDemand, "demand")
  }, [selectedProductDemand])

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Farm Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Price & demand forecast
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Revenue Chart (dummy) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(v) => `Rs. ${Number(v).toLocaleString()}`} />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="8 8"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Price Forecast */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Price Forecast (Rs./kg)
          </CardTitle>
          <Select
            value={selectedProductPrice}
            onValueChange={setSelectedProductPrice}
            disabled={loadingPrice}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loadingPrice ? (
            <div className="flex h-96 items-center justify-center text-gray-500">
              Loading predictions...
            </div>
          ) : priceData.length === 0 ? (
            <div className="flex h-96 items-center justify-center text-red-500 font-medium">
              {errorPrice || "No price data available"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(v) => `Rs. ${Number(v).toFixed(2)}`} />
                <ReferenceLine
                  x={currentMonthPrice}
                  stroke="#ef4444"
                  strokeDasharray="6 6"
                  label="Now"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  dot={{ r: 6 }}
                  name="Predicted Price"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Demand Forecast */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-purple-600" />
            Demand Forecast (kg)
          </CardTitle>
          <Select
            value={selectedProductDemand}
            onValueChange={setSelectedProductDemand}
            disabled={loadingDemand}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loadingDemand ? (
            <div className="flex h-96 items-center justify-center text-gray-500">
              Loading...
            </div>
          ) : demandData.length === 0 ? (
            <div className="flex h-96 items-center justify-center text-red-500 font-medium">
              {errorDemand || "No demand data available"}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(v) => `${Math.round(Number(v))} kg`} />
                <ReferenceLine
                  x={currentMonthDemand}
                  stroke="#ef4444"
                  strokeDasharray="6 6"
                  label="Now"
                />
                <Bar dataKey="predicted" fill="#c4b5fd" name="Predicted Demand" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}