"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Sample trending products data
const trendingProducts = [
  {
    id: 1,
    name: "Organic Tomatoes",
    image: "/assets/images/tomatoes.jpg?height=100&width=100",
    price: "Rs.45/kg",
    category: "Vegetables",
    sales: 24,
    revenue: "Rs.1080",
  },
  {
    id: 2,
    name: "Fresh Onions",
    image: "/assets/images/onions.jpg?height=100&width=100",
    price: "Rs.35/kg",
    category: "Vegetables",
    sales: 18,
    revenue: "Rs.630",
  },
  {
    id: 3,
    name: "Premium Potatoes",
    image: "/assets/images/potatoes.jpg?height=100&width=100",
    price: "Rs.30/kg",
    category: "Vegetables",
    sales: "15 kg",
    revenue: "Rs.450",
  },
  {
    id: 4,
    name: "Organic Carrots",
    image: "/assets/images/carrots.jpg?height=100&width=100",
    price: "Rs.40/kg",
    category: "Vegetables",
    sales: "12 kg",
    revenue: "Rs.480",
  },
  {
    id: 5,
    name: "Fresh Apples",
    image: "/assets/images/apples.jpg?height=100&width=100",
    price: "Rs.120/kg",
    category: "Fruits",
    sales: "30 kg",
    revenue: "Rs.3600",
  },
  {
    id: 6,
    name: "Organic Bananas",
    image: "/assets/images/bananas.jpg?height=100&width=100",
    price: "Rs.60/dozen",
    category: "Fruits",
    sales: "22 kg",
    revenue: "Rs.1320",
  },
  {
    id: 7,
    name: "Premium Mangoes",
    image: "/assets/images/mangoes.jpg?height=100&width=100",
    price: "Rs.200/kg",
    category: "Fruits",
    sales: "35 kg",
    revenue: "Rs.7000",
  },
  {
    id: 8,
    name: "Organic Rice",
    image: "/assets/images/rice.jpg?height=100&width=100",
    price: "Rs.80/kg",
    category: "Grains",
    sales: "20 kg",
    revenue: "Rs.1600",
  },
]

export default function TrendingProductsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trending Products</h1>
          <p className="text-muted-foreground">View your most popular products and current order requests.</p>
        </div>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100 mx-4">
                  <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                    />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="font-bold text-green-600">Revenue: {product.revenue}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{product.price}</p>
                      <Badge variant="outline" className="mt-1">
                        {product.sales} sales
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
    </div>
  )
}
