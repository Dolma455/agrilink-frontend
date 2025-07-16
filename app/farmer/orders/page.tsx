// "use client"
// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Search, Filter, Eye, MessageSquare } from "lucide-react"
// //import { VendorProfileModal } from "../../../components/vendor-profile-modal"

// // Sample vendor data
// const vendorProfiles = {
//   VEND001: {
//     id: "VEND001",
//     name: "Fresh Mart Store",
//     email: "contact@freshmart.com",
//     phone: "+977-1-4567890",
//     location: "Kathmandu, Nepal",
//     rating: 4.8,
//     totalOrders: 156,
//     joinedDate: "March 2023",
//     specialties: ["Organic Vegetables", "Fresh Fruits", "Dairy Products"],
//     description:
//       "Leading organic food retailer in Kathmandu with focus on fresh, locally sourced produce. We pride ourselves on quality and customer satisfaction.",
//     recentOrders: [
//       { id: "ORD001", product: "Organic Tomatoes", quantity: "50kg", date: "Jan 15, 2024", status: "Completed" },
//       { id: "ORD002", product: "Fresh Onions", quantity: "30kg", date: "Jan 12, 2024", status: "Completed" },
//       { id: "ORD003", product: "Premium Potatoes", quantity: "40kg", date: "Jan 10, 2024", status: "Pending" },
//     ],
//   },
//   VEND002: {
//     id: "VEND002",
//     name: "Green Valley Market",
//     email: "info@greenvalley.com",
//     phone: "+977-1-9876543",
//     location: "Pokhara, Nepal",
//     rating: 4.6,
//     totalOrders: 89,
//     joinedDate: "June 2023",
//     specialties: ["Seasonal Vegetables", "Root Vegetables", "Leafy Greens"],
//     description:
//       "Family-owned market specializing in seasonal and traditional vegetables. Serving Pokhara community for over 10 years.",
//     recentOrders: [
//       { id: "ORD004", product: "Seasonal Mix", quantity: "25kg", date: "Jan 14, 2024", status: "In Progress" },
//       { id: "ORD005", product: "Leafy Greens", quantity: "15kg", date: "Jan 11, 2024", status: "Completed" },
//     ],
//   },
//   VEND003: {
//     id: "VEND003",
//     name: "Organic Foods Co.",
//     email: "orders@organicfoods.com",
//     phone: "+977-1-5555666",
//     location: "Lalitpur, Nepal",
//     rating: 4.9,
//     totalOrders: 203,
//     joinedDate: "January 2023",
//     specialties: ["Certified Organic", "Premium Quality", "Bulk Orders"],
//     description:
//       "Certified organic food distributor with strict quality standards. We work directly with certified organic farmers across Nepal.",
//     recentOrders: [
//       { id: "ORD006", product: "Organic Carrots", quantity: "60kg", date: "Jan 16, 2024", status: "Completed" },
//       { id: "ORD007", product: "Organic Tomatoes", quantity: "80kg", date: "Jan 13, 2024", status: "Completed" },
//       { id: "ORD008", product: "Mixed Vegetables", quantity: "45kg", date: "Jan 09, 2024", status: "Completed" },
//     ],
//   },
// }

// // Sample orders data
// const ordersData = [
//   {
//     id: "ORD001",
//     vendorId: "VEND001",
//     vendorName: "Fresh Mart Store",
//     product: "Organic Tomatoes",
//     quantity: "50kg",
//     pricePerKg: "Rs. 52",
//     totalAmount: "Rs. 2,600",
//     orderDate: "2024-01-15",
//     deliveryDate: "2024-01-18",
//     status: "Completed",
//     paymentStatus: "Paid",
//   },
//   {
//     id: "ORD002",
//     vendorId: "VEND002",
//     vendorName: "Green Valley Market",
//     product: "Fresh Onions",
//     quantity: "30kg",
//     pricePerKg: "Rs. 41",
//     totalAmount: "Rs. 1,230",
//     orderDate: "2024-01-12",
//     deliveryDate: "2024-01-15",
//     status: "In Transit",
//     paymentStatus: "Paid",
//   },
//   {
//     id: "ORD003",
//     vendorId: "VEND003",
//     vendorName: "Organic Foods Co.",
//     product: "Premium Potatoes",
//     quantity: "40kg",
//     pricePerKg: "Rs. 35",
//     totalAmount: "Rs. 1,400",
//     orderDate: "2024-01-10",
//     deliveryDate: "2024-01-13",
//     status: "Delivered",
//     paymentStatus: "Paid",
//   },
//   {
//     id: "ORD004",
//     vendorId: "VEND001",
//     vendorName: "Fresh Mart Store",
//     product: "Organic Carrots",
//     quantity: "25kg",
//     pricePerKg: "Rs. 45",
//     totalAmount: "Rs. 1,125",
//     orderDate: "2024-01-08",
//     deliveryDate: "2024-01-11",
//     status: "Pending",
//     paymentStatus: "Pending",
//   },
//   {
//     id: "ORD005",
//     vendorId: "VEND002",
//     vendorName: "Green Valley Market",
//     product: "Mixed Vegetables",
//     quantity: "35kg",
//     pricePerKg: "Rs. 38",
//     totalAmount: "Rs. 1,330",
//     orderDate: "2024-01-05",
//     deliveryDate: "2024-01-08",
//     status: "Completed",
//     paymentStatus: "Paid",
//   },
// ]

// export default function FarmerOrdersPage() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
//   const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)

//   const filteredOrders = ordersData.filter((order) => {
//     const matchesSearch =
//       order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()
//     return matchesSearch && matchesStatus
//   })

//   const handleVendorClick = (vendorId: string) => {
//     setSelectedVendor(vendorId)
//     setIsVendorModalOpen(true)
//   }

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "in transit":
//         return "bg-blue-100 text-blue-800"
//       case "delivered":
//         return "bg-purple-100 text-purple-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getPaymentStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "paid":
//         return "bg-green-100 text-green-800"
//       case "pending":
//         return "bg-yellow-100 text-yellow-800"
//       case "overdue":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
//             <p className="text-gray-600">Track and manage your product orders</p>
//           </div>
//           <Button className="bg-green-600 hover:bg-green-700">
//             <MessageSquare className="h-4 w-4 mr-2" />
//             Contact Support
//           </Button>
//         </div>


//         {/* Order Summary Cards */}
       
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardContent className="p-4">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-green-600">
//                     {ordersData.filter((o)=>o.status==="Completed").length}
//                   </p>
//                   <p className="text-sm text-gray-600"> Completed Orders</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardContent className="p-4">
//                 <div className="text-center">
//                   <p className="text-2xl font-bold text-green-600">
//                     {ordersData.filter((o)=>o.status==="In Transit").length}
//                   </p>
//                   <p className="text-sm text-gray-600"> In Transit</p>
//                 </div>
//               </CardContent>
//             </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-yellow-600">
//                   {ordersData.filter((o) => o.status === "Pending").length}
//                 </p>
//                 <p className="text-sm text-gray-600">Pending Orders</p>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-purple-600">
//                   Rs.{" "}
//                   {ordersData
//                     .reduce((sum, order) => sum + Number.parseInt(order.totalAmount.replace(/[^\d]/g, "")), 0)
//                     .toLocaleString()}
//                 </p>
//                 <p className="text-sm text-gray-600">Total Revenue</p>
//               </div>
//             </CardContent>
//           </Card>
//           </div>
//         {/* Filters */}
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//                   <Input
//                     placeholder="Search by product or vendor name..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Filter className="h-4 w-4 text-gray-500" />
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-48">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="in transit">In Transit</SelectItem>
//                     <SelectItem value="delivered">Delivered</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

      

//         {/* Orders Table */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Orders ({filteredOrders.length})</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Order ID</TableHead>
//                     <TableHead>Vendor</TableHead>
//                     <TableHead>Product</TableHead>
//                     <TableHead>Quantity</TableHead>
//                     <TableHead>Price/Kg</TableHead>
//                     <TableHead>Total Amount</TableHead>
//                     <TableHead>Order Date</TableHead>
//                     <TableHead>Delivery Date</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>

//                <TableBody>
//                   {filteredOrders.map((order) => (
//                     <TableRow key={order.id}>
//                       <TableCell className="font-medium">{order.id}</TableCell>
//                       <TableCell>
//                         <button
//                           onClick={() => handleVendorClick(order.vendorId)}
//                           className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
//                         >
//                           {order.vendorName}
//                         </button>
//                       </TableCell>
//                       <TableCell>{order.product}</TableCell>
//                       <TableCell>{order.quantity}</TableCell>
//                       <TableCell>{order.pricePerKg}</TableCell>
//                       <TableCell className="font-semibold">{order.totalAmount}</TableCell>
//                       <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
//                       <TableCell>{new Date(order.deliveryDate).toLocaleDateString()}</TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//                       </TableCell>

//                       <TableCell>
//                         <Button variant="outline" size="sm">
//                           <Eye className="h-4 w-4 mr-1"/>
//                           View
//                         </Button>
//                       </TableCell>

                      

//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
      
//         {/* Vendor Profile Modal */}
        
//       </div>
//     </div>
//   )
// }



"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock, Eye, Filter, Package, Plus, Search, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function VendorOrdersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  type Order = {
    id: string
    product: string
    quantity: string
    requestedPrice: string
    totalAmount: string
    status: string
    requestDate: string
    vendorName?: string
    farmer?: string
    farmName?: string
    location: string
    expectedDelivery: string
    productImage: string
  }
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderList, setOrderList] = useState([
    {
      id: "ORD001",
      product: "Tomatoes",
      quantity: "50kg",
      requestedPrice: "Rs.30/kg",
      totalAmount: "Rs.1,500",
      status: "pending",
      requestDate: "2024-01-15",
      vendorName: "ABC Vendor",
      location: "Kathmandu",
      expectedDelivery: "2024-01-18",
      productImage: "/assets/images/tomatoes.jpg?height=200&width=200"
    },
    {
      id: "ORD002",
      product: "Onions",
      quantity: "30kg",
      requestedPrice: "Rs.40/kg",
      totalAmount: "Rs.1,200",
      status: "pending",
      requestDate: "2024-01-14",
      vendorName: "XYZ Vendor",
      location: "Jhapa",
      expectedDelivery: "2024-01-17",
      productImage: "/assets/images/onions.jpg?height=200&width=200"
    },
    {
      id: "ORD003",
      product: "Potatoes",
      quantity: "80kg",
      requestedPrice: "Rs.25/kg",
      totalAmount: "Rs.2,000",
      status: "delivered",
      requestDate: "2024-01-12",
      farmer: "Ram Prasad",
      farmName: "Hill View Farm",
      location: "Bhaktapur",
      expectedDelivery: "2024-01-15",
      productImage: "/assets/images/potatoes.jpg?height=200&width=200"
    },
    {
      id: "ORD004",
      product: "Carrots",
      quantity: "25kg",
      requestedPrice: "Rs.35/kg",
      totalAmount: "Rs.875",
      status: "delivered",
      requestDate: "2024-01-13",
      vendorName: "Various",
      location: "Boudhha",
      expectedDelivery: "-",
      productImage: "/assets/images/carrots.jpg?height=200&width=200"
    },
    {
      id: "ORD005",
      product: "Rice",
      quantity: "100kg",
      requestedPrice: "Rs.45/kg",
      totalAmount: "Rs.4,500",
      status: "pending",
      requestDate: "2024-01-16",
      vendorName: "Golden Grains",
      location: "Kathmandu",
      expectedDelivery: "2024-01-19",
      productImage: "/assets/images/rice.jpg?height=200&width=200"
    },
  ])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const, icon: Clock, color: "" },
      delivered: { label: "Delivered", variant: "default" as const, icon: Package, color: "bg-green-100 text-green-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color || ""}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = orderList.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const orderDate = new Date(order.requestDate)
      const today = new Date()

      if (dateFilter === "today") {
        matchesDate = orderDate.toDateString() === today.toDateString()
      } else if (dateFilter === "week") {
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= lastWeek
      } else if (dateFilter === "month") {
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        matchesDate = orderDate >= lastMonth
      }
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleDelete = (id: string) => {
    const updatedOrders = orderList.filter(order => order.id !== id)
    setOrderList(updatedOrders)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="p-6 space-y-6">
         {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track all your product orders and requests</p>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Order ID / Product / Farmer"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDateFilter("all")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.requestedPrice}</TableCell>
                      <TableCell>{order.totalAmount}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-muted-foreground">{order.vendorName}</div>
                          <div className="text-xs text-muted-foreground">{order.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.requestDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4 mr-1" />
                              </Button>
                              
                            </DialogTrigger>
                            <DialogContent>
                              <DialogTitle>Order Details</DialogTitle>
                              {selectedOrder && (
                                <div className="space-y-2">
                                  <img
                                    src={selectedOrder.productImage}
                                    alt="product"
                                    className="w-full h-48 object-cover rounded-md"
                                  />
                                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                                  <p><strong>Product:</strong> {selectedOrder.product}</p>
                                  <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                                  <p><strong>Price/Unit:</strong> {selectedOrder.requestedPrice}</p>
                                  <p><strong>Total:</strong> {selectedOrder.totalAmount}</p>
                                  <p><strong>Vendor:</strong> {selectedOrder.vendorName}</p>
                                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                                  <p><strong>Request Date:</strong> {selectedOrder.requestDate}</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                               <Button variant="ghost" size="sm" onClick={() => handleDelete(order.id)}>
                            <Trash className="h-4 w-4 text-destructive"/>
                          </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
