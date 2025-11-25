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
  ShoppingCart,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import axiosML from "@/lib/axiosML"

export default function VendorReports() {
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

  const fmt = (d: string) =>
    new Date(d).toLocaleString("default", { month: "short", year: "numeric" })

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
      const res = await axiosML.post("/predict", {
        product_id: productId,
        months: 6,
      })

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
      console.error(`ML API failed (${type}):`, err)
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
            Vendor Analytics Dashboard
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

      {/* Price Forecast (Orange) */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-orange-600" />
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
                  stroke="#f97316"           // Orange
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

      {/* Demand Forecast (Purple) */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-purple-600" />
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
                <Bar
                  dataKey="predicted"
                  fill="#f97316"           // Light Purple
                  name="Predicted Demand"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}