"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { TrendingUp, Calendar, DollarSign, Package, Filter } from "lucide-react"

// 6 months before and 6 months after current date
const analyticsData = {
  revenue: [
    { period: "Jul 2023", actual: 18500, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 21200, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 24800, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 28200, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 32100, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 35600, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 39200, predicted: 38800, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 42500, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 46200, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 50100, type: "future" },
    { period: "May 2024", actual: null, predicted: 54800, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 59200, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 64100, type: "future" },
  ],
  demand: [
    { period: "Jul 2023", actual: 450, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 520, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 680, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 750, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 820, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 890, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 960, predicted: 945, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 1040, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 1120, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 1210, type: "future" },
    { period: "May 2024", actual: null, predicted: 1300, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 1390, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 1480, type: "future" },
  ],
}

// Product-specific price data
const productPriceData = {
  tomatoes: [
    { period: "Jul 2023", actual: 32, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 35, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 38, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 42, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 45, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 48, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 52, predicted: 51, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 55, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 58, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 62, type: "future" },
    { period: "May 2024", actual: null, predicted: 66, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 70, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 74, type: "future" },
  ],
  onions: [
    { period: "Jul 2023", actual: 25, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 28, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 30, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 32, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 35, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 38, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 41, predicted: 40, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 43, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 46, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 49, type: "future" },
    { period: "May 2024", actual: null, predicted: 52, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 55, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 58, type: "future" },
  ],
  potatoes: [
    { period: "Jul 2023", actual: 22, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 24, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 26, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 28, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 30, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 32, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 35, predicted: 34, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 37, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 40, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 43, type: "future" },
    { period: "May 2024", actual: null, predicted: 46, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 49, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 52, type: "future" },
  ],
  carrots: [
    { period: "Jul 2023", actual: 30, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 33, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 35, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 38, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 40, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 42, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 45, predicted: 44, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 47, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 50, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 53, type: "future" },
    { period: "May 2024", actual: null, predicted: 56, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 59, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 62, type: "future" },
  ],
}

export default function FarmerReports() {
  const [selectedProduct, setSelectedProduct] = useState("tomatoes")
  const currentPriceData = productPriceData[selectedProduct as keyof typeof productPriceData]

  const products = [
    { value: "tomatoes", label: "Tomatoes" },
    { value: "onions", label: "Onions" },
    { value: "potatoes", label: "Potatoes" },
    { value: "carrots", label: "Carrots" },
  ]

  const getCurrentPrice = () => {
    const currentData = currentPriceData.find((item) => item.type === "present")
    return currentData?.actual || 0
  }

  const getNextMonthPrice = () => {
    const futureData = currentPriceData.find((item) => item.type === "future")
    return futureData?.predicted || 0
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farm Analytics Dashboard</h1>
            <p className="text-gray-600">6 months historical data and 6 months future predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Current: January 2024</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Revenue Growth Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">+64%</div>
                <p className="text-sm text-gray-600">Expected growth over next 6 months</p>
                <Badge className="bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Strong Growth Trend
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Average Price Increase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">+42%</div>
                <p className="text-sm text-gray-600">Predicted price rise over 6 months</p>
                <Badge className="bg-blue-100 text-blue-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Market Inflation
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                Demand Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">+54%</div>
                <p className="text-sm text-gray-600">Market demand increase forecast</p>
                <Badge className="bg-purple-100 text-purple-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  High Demand
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Revenue Trends (6 Months Past + 6 Months Future)
            </CardTitle>
            <p className="text-sm text-gray-600">Historical actual data and future predictions (Rs.)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `Rs. ${value?.toLocaleString()}`,
                    name === "actual" ? "Actual Revenue" : "Predicted Revenue",
                  ]}
                />
                <ReferenceLine x="Jan 2024" stroke="#ef4444" strokeDasharray="2 2" label="Current Month" />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="actual"
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="predicted"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Current Month:</strong> Rs. 39,200
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Next Month:</strong> Rs. 42,500
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  <strong>6 Months Later:</strong> Rs. 64,100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Predictions Chart*/}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Price Predictions by Product
                </CardTitle>
                <p className="text-sm text-gray-600">Historical and predicted prices (Rs./kg)</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.value} value={product.value}>
                        {product.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={currentPriceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `Rs. ${value}/kg`,
                    name === "actual" ? "Actual Price" : "Predicted Price",
                  ]}
                />
                <ReferenceLine x="Jan 2024" stroke="#ef4444" strokeDasharray="2 2" label="Current Month" />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="actual"
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  strokeDasharray="8 8"
                  name="predicted"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Current Price:</strong> Rs. {getCurrentPrice()}/kg
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Next Month:</strong> Rs. {getNextMonthPrice()}/kg
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  <strong>Price Change:</strong> +
                  {(((getNextMonthPrice() - getCurrentPrice()) / getCurrentPrice()) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demand Predictions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Market Demand Trends (6 Months Past + 6 Months Future)
            </CardTitle>
            <p className="text-sm text-gray-600">Historical and predicted market demand (kg)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.demand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value?.toLocaleString()} kg`,
                    name === "actual" ? "Actual Demand" : "Predicted Demand",
                  ]}
                />
                <ReferenceLine x="Jan 2024" stroke="#ef4444" strokeDasharray="2 2" label="Current Month" />
                <Bar dataKey="actual" fill="#8b5cf6" name="actual" />
                <Bar dataKey="predicted" fill="#a78bfa" name="predicted" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700">
                  <strong>Current Demand:</strong> 960 kg
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg border border-purple-300">
                <p className="text-sm text-purple-700">
                  <strong>Next Month:</strong> 1,040 kg
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700">
                  <strong>6 Months Later:</strong> 1,480 kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
