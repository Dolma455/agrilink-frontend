"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axiosInstance"
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
import { TrendingUp, Calendar, DollarSign, ShoppingCart, Filter, Loader2 } from "lucide-react"

// 6 months before and 6 months after current date
const analyticsData = {
  costs: [
    { period: "Jul 2023", actual: 25500, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 28200, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 31800, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 35600, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 39800, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 44200, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 48900, predicted: 47800, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 53200, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 58100, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 63500, type: "future" },
    { period: "May 2024", actual: null, predicted: 69200, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 75400, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 82100, type: "future" },
  ],
  demand: [
    { period: "Jul 2023", actual: 380, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 420, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 480, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 540, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 600, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 660, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 720, predicted: 710, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 780, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 840, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 900, type: "future" },
    { period: "May 2024", actual: null, predicted: 960, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 1020, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 1080, type: "future" },
  ],
}

// Product-specific price data
const productPriceData = {
  tomatoes: [
    { period: "Jul 2023", actual: 35, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 38, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 41, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 45, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 48, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 51, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 55, predicted: 54, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 58, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 62, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 66, type: "future" },
    { period: "May 2024", actual: null, predicted: 70, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 74, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 78, type: "future" },
  ],
  onions: [
    { period: "Jul 2023", actual: 28, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 30, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 33, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 35, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 38, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 41, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 44, predicted: 43, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 47, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 50, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 53, type: "future" },
    { period: "May 2024", actual: null, predicted: 56, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 59, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 62, type: "future" },
  ],
  potatoes: [
    { period: "Jul 2023", actual: 25, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 27, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 29, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 31, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 33, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 35, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 38, predicted: 37, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 40, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 43, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 46, type: "future" },
    { period: "May 2024", actual: null, predicted: 49, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 52, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 55, type: "future" },
  ],
  carrots: [
    { period: "Jul 2023", actual: 33, predicted: null, type: "past" },
    { period: "Aug 2023", actual: 36, predicted: null, type: "past" },
    { period: "Sep 2023", actual: 38, predicted: null, type: "past" },
    { period: "Oct 2023", actual: 41, predicted: null, type: "past" },
    { period: "Nov 2023", actual: 43, predicted: null, type: "past" },
    { period: "Dec 2023", actual: 45, predicted: null, type: "past" },
    { period: "Jan 2024", actual: 48, predicted: 47, type: "present" },
    { period: "Feb 2024", actual: null, predicted: 50, type: "future" },
    { period: "Mar 2024", actual: null, predicted: 53, type: "future" },
    { period: "Apr 2024", actual: null, predicted: 56, type: "future" },
    { period: "May 2024", actual: null, predicted: 59, type: "future" },
    { period: "Jun 2024", actual: null, predicted: 62, type: "future" },
    { period: "Jul 2024", actual: null, predicted: 65, type: "future" },
  ],
}

export default function VendorReports() {
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

  // API Price Predictions by Commodity
  type PredictionPoint = { period: string; predicted: number; type: string }

  const COMMODITIES: string[] = [
    "Tomato Big(Nepali)", "Tomato Small(Local)", "Potato Red", "Potato White",
    "Onion Dry (Indian)", "Carrot(Local)", "Cabbage(Local)", "Cauli Local",
    "Raddish Red", "Raddish White(Local)", "Brinjal Long", "Brinjal Round",
    "Cow pea(Long)", "Green Peas", "French Bean(Local)", "Soyabean Green",
    "Bitter Gourd", "Bottle Gourd", "Pointed Gourd(Local)", "Snake Gourd",
    "Smooth Gourd", "Sponge Gourd", "Pumpkin", "Squash(Long)", "Turnip", "Okara",
    "Christophine", "Brd Leaf Mustard", "Spinach Leaf", "Cress Leaf",
    "Mustard Leaf", "Fenugreek Leaf", "Onion Green", "Mushroom(Kanya)",
    "Asparagus", "Neuro", "Brocauli", "Sugarbeet", "Drumstick", "Red Cabbbage",
    "Lettuce", "Celery", "Parseley", "Fennel Leaf", "Mint", "Turnip A", "Tamarind",
    "Bamboo Shoot", "Tofu", "Gundruk", "Apple(Jholey)", "Banana", "Lime",
    "Pomegranate", "Mango(Maldah)", "Grapes(Green)", "Water Melon(Green)",
    "Sweet Orange", "Pineapple", "Cucumber(Local)", "Jack Fruit",
    "Papaya(Nepali)", "Sugarcane", "Ginger", "Chilli Dry", "Chilli Green",
    "Capsicum", "Garlic Green", "Coriander Green", "Garlic Dry Chinese",
    "Garlic Dry Nepali", "Clive Dry", "Clive Green", "Fish Fresh", "Arum", "Maize",
    "Sweet Lime", "Guava", "Mombin", "Barela", "Lemon", "Sword Bean",
    "Orange(Nepali)", "Bakula", "Yam", "Sweet Potato", "Mandarin", "Knolkhol",
    "Cauli Terai", "Kinnow", "Strawberry", "Bauhania flower", "Pear(Local)",
    "Litchi(Local)", "Musk Melon", "Tomato Small(Tunnel)", "Potato Red(Indian)",
    "Mushroom(Button)", "Apple(Fuji)", "Cucumber(Hybrid)",
    "Chilli Green(Bullet)", "Chilli Green(Machhe)", "Chilli Green(Akbare)",
    "Fish Fresh(Rahu)", "Fish Fresh(Bachuwa)", "Fish Fresh(Chhadi)",
    "Fish Fresh(Mungari)", "Raddish White(Hybrid)", "Cowpea(Short)",
    "French Bean(Hybrid)", "French Bean(Rajma)", "Squash(Round)",
    "Mango(Dushari)", "Water Melon(Dotted)", "Papaya(Indian)", "Litchi(Indian)",
    "Cabbage", "Potato Red(Mude)", "Tomato Big(Indian)", "Pear(Chinese)",
    "Tomato Small(Indian)", "Orange(Indian)", "Carrot(Terai)",
    "Tomato Small(Terai)", "Onion Dry (Chinese)", "Cabbage(Terai)",
    "Cauli Local(Jyapu)", "Pointed Gourd(Terai)", "Grapes(Black)", "Kiwi",
    "Mango(Calcutte)", "Mango(Chousa)", "Sarifa", "Avocado", "Amla",
  ]

  const [selectedCommodity, setSelectedCommodity] = useState<string>(COMMODITIES[0])
  const [commoditySearch, setCommoditySearch] = useState("")
  const [predLoading, setPredLoading] = useState(false)
  const [predError, setPredError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<PredictionPoint[]>([])

  const filteredCommodities = useMemo(
    () => COMMODITIES.filter((c) => c.toLowerCase().includes(commoditySearch.toLowerCase())).slice(0, 200),
    [COMMODITIES, commoditySearch]
  )

  const fetchPredictions = async (commodity: string) => {
    try {
      setPredLoading(true)
      setPredError(null)
      // API Endpoint to predict price
      const url = `http://localhost:8000/predict/${encodeURIComponent(commodity)}`
      const res = await axiosInstance.get(url, { headers: { accept: "*/*" } })
      const data = Array.isArray(res.data) ? res.data : (res.data?.output || [])
      setPredictions(data as PredictionPoint[])
    } catch (err: any) {
      console.error("Fetch Predictions Error", err)
      setPredError(err.response?.data?.message || err.message || "Failed to fetch predictions")
      setPredictions([])
    } finally {
      setPredLoading(false)
    }
  }

  useEffect(() => {
    fetchPredictions(selectedCommodity)
  }, [selectedCommodity])

  const splitIndex = useMemo(() => {
    if (!predictions || predictions.length === 0) return 0
    const futureIdx = predictions.findIndex((p: any) => String(p?.type ?? "").toLowerCase().includes("future") || String(p?.status ?? "").toLowerCase().includes("future") || String(p?.phase ?? "").toLowerCase().includes("future"))
    if (futureIdx !== -1) return futureIdx
    const presentIdx = predictions.findIndex((p: any) => ["present", "current"].includes(String(p?.type ?? "").toLowerCase()))
    if (presentIdx !== -1) return presentIdx + 1
    const futureBoolIdx = predictions.findIndex((p: any) => p?.isFuture === true || p?.future === true || p?.is_future === true)
    if (futureBoolIdx !== -1) return futureBoolIdx
    return predictions.length >= 8 ? Math.floor(predictions.length / 2) : predictions.length
  }, [predictions])

  const composedPredictions = useMemo(() => (
    predictions.map((p, i) => ({
      period: p.period,
      predictedCurrent: i < splitIndex ? p.predicted : null,
      predictedFuture: i >= splitIndex ? p.predicted : null,
    }))
  ), [predictions, splitIndex])

  const hasCurrent = useMemo(() => composedPredictions.some(d => d.predictedCurrent != null), [composedPredictions])
  const hasFuture = useMemo(() => composedPredictions.some(d => d.predictedFuture != null), [composedPredictions])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Analytics Dashboard</h1>
            <p className="text-gray-600">6 months historical data and 6 months future predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Current: January 2024</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                Cost Increase Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">+68%</div>
                <p className="text-sm text-gray-600">Expected cost increase over next 6 months</p>
                <Badge className="bg-red-100 text-red-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Rising Procurement Costs
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
                <p className="text-sm text-gray-600">Market price rise over 6 months</p>
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
                <ShoppingCart className="h-4 w-4 text-purple-600" />
                Demand Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">+50%</div>
                <p className="text-sm text-gray-600">Market demand increase forecast</p>
                <Badge className="bg-purple-100 text-purple-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Growing Market
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              Procurement Cost Trends (6 Months Past + 6 Months Future)
            </CardTitle>
            <p className="text-sm text-gray-600">Historical actual costs and future predictions (Rs.)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.costs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `Rs. ${value?.toLocaleString()}`,
                    name === "actual" ? "Actual Cost" : "Predicted Cost",
                  ]}
                />
                <ReferenceLine x="Jan 2024" stroke="#ef4444" strokeDasharray="2 2" label="Current Month" />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#f97316"
                  strokeWidth={3}
                  name="actual"
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 5 }}
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
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  <strong>Current Month:</strong> Rs. 48,900
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Next Month:</strong> Rs. 53,200
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>6 Months Later:</strong> Rs. 82,100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Predictions (API) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Price Predictions  by Product
                </CardTitle>
                <p className="text-sm text-gray-600">Predicted prices returned by the API (Rs./kg)</p>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Input
                      value={commoditySearch}
                      onChange={(e) => setCommoditySearch(e.target.value)}
                      placeholder="Search commodity..."
                      className="w-56"
                    />
                  </div>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCommodities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {predError && (
              <div className="p-3 mb-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                {predError}
              </div>
            )}
            {predLoading ? (
              <div className="h-[200px] flex items-center justify-center text-gray-600">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Fetching predictions...
              </div>
            ) : predictions.length === 0 ? (
              <div className="text-gray-600">No prediction data available.</div>
            ) : (
              <div>
                {!hasCurrent && hasFuture && (
                  <div className="mb-2 text-xs text-gray-600">
                    Note: API returned only future predictions. No current/historical points were provided.
                  </div>
                )}
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={composedPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      `Rs. ${Number(value).toFixed(2)}/kg`,
                      name === "predictedFuture" ? "Future Price" : "Current/Actual Price",
                    ]} />
                    <Line
                      type="monotone"
                      dataKey="predictedCurrent"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                      name="predictedCurrent"
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="predictedFuture"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      strokeDasharray="8 8"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      name="predictedFuture"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Selected:</strong> {selectedCommodity}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Min Predicted:</strong> Rs. {Math.min(...predictions.map(p => p.predicted)).toFixed(2)} /kg
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700">
                      <strong>Max Predicted:</strong> Rs. {Math.max(...predictions.map(p => p.predicted)).toFixed(2)} /kg
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        

        {/* Demand Predictions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
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
                <Bar dataKey="actual" fill="#f97316" name="actual" />
                <Bar dataKey="predicted" fill="#fb923c" name="predicted" opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-700">
                  <strong>Current Demand:</strong> 720 kg
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg border border-orange-300">
                <p className="text-sm text-orange-700">
                  <strong>Next Month:</strong> 780 kg
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>6 Months Later:</strong> 1,080 kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
