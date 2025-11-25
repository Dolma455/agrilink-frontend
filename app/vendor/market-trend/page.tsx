"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Product {
  productId: string;
  productName: string;
  unitName: string;
}

interface PricePoint {
  date: string;
  price: number;
  formattedPrice: string;
  dateLabel: string;
}

interface PriceTrendData {
  productName: string;
  unit: string;
  yourCostPriceTrend: PricePoint[];
  marketAveragePriceTrend: PricePoint[];
  lowestMarketPriceTrend: PricePoint[];
  currentLowestPrice: number;
  currentMarketAverage: number;
  yourCurrentCost: number;
  recommendation: string;
  recommendationColor: "green" | "yellow" | "red" | "gray";
}

export default function PriceTrendPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [trendData, setTrendData] = useState<PriceTrendData | null>(null);
  const [loading, setLoading] = useState(true);

  const vendorId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch all products
  useEffect(() => {
    if (!vendorId) return;

    axiosInstance
      .get("/api/v1/product/all", { params: { page: 1, pageSize: 100 } })
      .then((res) => {
        if (res.data.isSuccess && res.data.data) {
          const prods = res.data.data.map((p: any) => ({
            productId: p.productId || p.id,
            productName: p.productName || p.name,
            unitName: p.unitName || p.unit,
          }));
          setProducts(prods);
          if (prods.length > 0) {
            setSelectedProductId(prods[0].productId);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  // Fetch price trend
  useEffect(() => {
    if (!selectedProductId || !vendorId) return;

    setTrendData(null);
    axiosInstance
      .get("/api/inventory/vendor/price-trend", {
        params: { vendorId, productId: selectedProductId, days: 90 },
      })
      .then((res) => {
        if (res.data.isSuccess && res.data.output) {
          setTrendData(res.data.output);
        }
      });
  }, [selectedProductId, vendorId]);

  // Combine data for chart
  const chartData =
    trendData?.marketAveragePriceTrend.map((avg, i) => ({
      dateLabel: avg.dateLabel,
      yourCost: trendData.yourCostPriceTrend[i]?.price > 0 ? trendData.yourCostPriceTrend[i].price : null,
      marketAvg: avg.price > 0 && avg.price < 10000 ? avg.price : null,
      lowest: trendData.lowestMarketPriceTrend[i]?.price > 0 && trendData.lowestMarketPriceTrend[i].price < 10000
        ? trendData.lowestMarketPriceTrend[i].price
        : null,
    })) || [];

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Price Trend Analysis
            </h1>
            <p className="text-gray-600 mt-2">
              Track your cost vs market prices over the last 90 days
            </p>
          </div>

          <Select value={selectedProductId} onValueChange={setSelectedProductId}>
            <SelectTrigger className="w-96">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.productId} value={p.productId}>
                  <div>
                    <div className="font-medium">{p.productName}</div>
                    <div className="text-xs text-gray-500">{p.unitName}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!trendData ? (
          <Card className="text-center py-16 text-gray-500">
            <CardContent>Select a product to view price trends</CardContent>
          </Card>
        ) : (
          <>
            {/* Product Header */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="h-8 my-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{trendData.productName}</CardTitle>
                    <CardDescription>
                      Unit: {trendData.unit} • Last 90 days
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Your Current Cost</p>
                      <p className="text-2xl font-bold text-orange-600">
                        Rs. {trendData.yourCurrentCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Market Average</p>
                      <p className="text-2xl font-bold text-blue-600">
                        Rs. {trendData.currentMarketAverage.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Recommendation Alert */}
            <div className={`
              p-5 rounded-lg border flex items-center gap-3
              ${trendData.recommendationColor === "green" ? "bg-green-50 border-green-200 text-green-800" :
                trendData.recommendationColor === "yellow" ? "bg-yellow-50 border-yellow-200 text-yellow-800" :
                trendData.recommendationColor === "red" ? "bg-red-50 border-red-200 text-red-800" :
                "bg-orange-50 border-orange-200 text-orange-800"}
            `}>
              {trendData.recommendation.includes("buy") || trendData.recommendation.includes("low") ? (
                <TrendingDown className="h-6 w-6" />
              ) : trendData.recommendation.includes("high") ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
              <p className="font-medium text-lg">{trendData.recommendation}</p>
            </div>

            {/* Price Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>90-Day Price Trend</CardTitle>
                <CardDescription>
                  Your cost vs Market Average vs Lowest Available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full gap-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="dateLabel"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => `Rs. ${value.toLocaleString()}`}
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="line"
                      />

                      {/* Your Cost Price */}
                      <Line
                        type="monotone"
                        dataKey="yourCost"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={false}
                        name="Your Cost Price"
                      />

                      {/* Market Average */}
                      <Line
                        type="monotone"
                        dataKey="marketAvg"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                        name="Market Average"
                      />

                      {/* Lowest Market Price */}
                      <Line
                        type="monotone"
                        dataKey="lowest"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Lowest Available"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
{/* 
                <div className="flex justify-center gap-8 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Your Cost Price</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Market Average</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Lowest Available</span>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Lowest Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {trendData.currentLowestPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">per {trendData.unit}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Market Average Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">
                    Rs. {trendData.currentMarketAverage.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">per {trendData.unit}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Your Current Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-orange-600">
                        Rs. {trendData.yourCurrentCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">per {trendData.unit}</p>
                    </div>
                    {trendData.yourCurrentCost > trendData.currentMarketAverage ? (
                      <Badge variant="destructive">Above Market</Badge>
                    ) : trendData.yourCurrentCost < trendData.currentLowestPrice * 1.1 ? (
                      <Badge className="bg-green-100 text-green-800">Great Deal!</Badge>
                    ) : (
                      <Badge variant="secondary">Fair</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <Skeleton className="h-12 w-80" />
      <Skeleton className="h-10 w-96" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}