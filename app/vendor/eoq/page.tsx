"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Calculator,
    Package,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Truck,
    Clock,
    CalendarIcon,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface Product {
    productId: string;
    productName: string;
    categoryName: string;
    unitName: string;
    totalQuantity: number;
}

interface EOQData {
    productName: string;
    unitName: string;
    currentStock: number;
    recommendedOrderQuantity: number;
    reorderPoint: number;
    safetyStock: number;
    estimatedLeadTimeDays: number;
    dailyDemand: number;
    shouldReorderNow: boolean;
    actionMessage: string;
    summary: string;
}

interface PriceRange {
    minPricePerUnit: number;
    maxPricePerUnit: number;
}

export default function EOQRecommendationPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const [eoq, setEoq] = useState<EOQData | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [openModal, setOpenModal] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
    const [location, setLocation] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const vendorId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        if (!vendorId) return;

        axiosInstance
            .get("/api/inventory/vendor", { params: { vendorId, page: 1, pageSize: 100 } })
            .then((res) => {
                if (res.data.isSuccess) {
                    setProducts(res.data.data);
                    if (res.data.data.length > 0) {
                        setSelectedProductId(res.data.data[0].productId);
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [vendorId]);

    useEffect(() => {
        if (!selectedProductId || !vendorId) return;

        axiosInstance
            .get("/api/inventory/vendor/eoq/recommendation", {
                params: { vendorId, productId: selectedProductId },
            })
            .then((res) => {
                if (res.data.isSuccess && res.data.output) {
                    setEoq(res.data.output);
                }
            });
    }, [selectedProductId, vendorId]);

    // Fetch price range when modal opens
    useEffect(() => {
        if (!openModal || !selectedProductId) return;

        setLoadingPrice(true);
        axiosInstance
            .get(`/api/v1/marketHub/priceRanges/$${selectedProductId}`)
            .then((res) => {
                if (res.data.isSuccess) {
                    setPriceRange(res.data.output || { minPrice: 0, maxPrice: 0 });
                }
            })
            .finally(() => setLoadingPrice(false));
    }, [openModal, selectedProductId]);

    const handleCreatePO = async () => {
        if (!eoq || !deliveryDate) return;

        setSubmitting(true);
        const payload = {
            vendorId,
            productId: selectedProductId,
            quantity: eoq.recommendedOrderQuantity,
            requiredDeliveryDate: deliveryDate.toISOString(),
            location,
            priceRangeMin: priceRange?.minPricePerUnit || 0,
            priceRangeMax: priceRange?.maxPricePerUnit || 0,
            additionalInfo: additionalInfo || "",
        };

        try {
            await axiosInstance.post("/api/v1/marketHub/create", payload);
            alert("Purchase order created successfully!");
            setOpenModal(false);
            // Reset form
            setDeliveryDate(undefined);
            setLocation("");
            setAdditionalInfo("");
        } catch (err) {
            alert("Failed to create purchase order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const daysLeft = eoq ? Math.floor(eoq.currentStock / Math.max(eoq.dailyDemand, 0.01)) : 0;
    const isCritical = eoq && eoq.currentStock <= eoq.reorderPoint;

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                            EOQ Recommendation
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Economic Order Quantity analysis and reorder suggestions
                        </p>
                    </div>

                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                        <SelectTrigger className="w-96 border-gray-300">
                            <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.productId} value={p.productId}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{p.productName}</span>
                                        <span className="text-sm text-gray-500">
                                            {p.categoryName} — {p.totalQuantity} {p.unitName}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {!eoq ? (
                    <Card className="border-gray-200">
                        <CardContent className="py-12 text-center text-gray-500">
                            Select a product to view EOQ recommendation
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-medium text-gray-900">
                                            {eoq.productName}
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            Current stock: {eoq.currentStock.toFixed(2)} {eoq.unitName}
                                        </CardDescription>
                                    </div>
                                    {eoq.shouldReorderNow ? (
                                        <Badge variant="destructive" className="text-sm px-4 py-1.5">
                                            <AlertCircle className="h-4 w-4 mr-1.5" />
                                            Reorder Required
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-emerald-100 text-emerald-800 text-sm px-4 py-1.5">
                                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                            Stock Sufficient
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                        </Card>

                        {eoq.shouldReorderNow && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <AlertDescription className="text-red-800 font-medium">
                                    {eoq.actionMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                                        Current Stock Level
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {eoq.currentStock.toFixed(1)} <span className="text-xl font-normal text-gray-600">{eoq.unitName}</span>
                                    </div>
                                    <Progress value={eoq.currentStock > eoq.reorderPoint + eoq.safetyStock ? 100 : eoq.currentStock > eoq.reorderPoint ? 60 : 25} className="mt-4 h-3" />
                                    <div className="flex justify-between mt-3 text-sm">
                                        <span className="text-gray-500">Reorder Point</span>
                                        <span className="font-medium">{eoq.reorderPoint} {eoq.unitName}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className={cn("border-gray-200 shadow-sm", isCritical && "ring-2 ring-red-500/20")}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Recommended Order Quantity
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold text-gray-900">
                                        {eoq.recommendedOrderQuantity}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{eoq.unitName} (Optimal EOQ)</p>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Estimated Days Until Depletion
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={cn("text-4xl font-bold", daysLeft < 15 ? "text-red-600" : daysLeft < 30 ? "text-orange-600" : "text-gray-900")}>
                                        {daysLeft}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">days at current demand</p>
                                </CardContent>
                            </Card>
                            <Card className="border-gray-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-500 uppercase">Daily Demand</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <span className="text-2xl font-semibold">{eoq.dailyDemand.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-500 uppercase">Reorder Point</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-semibold">{eoq.reorderPoint} {eoq.unitName}</span>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-medium text-gray-500 uppercase">Safety Stock</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-2xl font-semibold">{eoq.safetyStock} {eoq.unitName}</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CTA */}
                        <div className="flex justify-end pt-2">
                            <Button
                                size="lg"
                                variant={eoq.shouldReorderNow ? "destructive" : "default"}
                                className={`text-base px-8 ${eoq.shouldReorderNow ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                                onClick={() => setOpenModal(true)}
                                disabled={!eoq.shouldReorderNow}
                            >
                                {eoq.shouldReorderNow ? (
                                    <>
                                        <AlertCircle className="mr-2 h-5 w-5" />
                                        Create Purchase Order — {eoq.recommendedOrderQuantity} {eoq.unitName}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-5 w-5" />
                                        Chill, You are Good 😎
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>

            {/* Purchase Order Modal */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                        <DialogDescription>
                            Order <strong>{eoq?.recommendedOrderQuantity} {eoq?.unitName}</strong> of <strong>{eoq?.productName}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label>Required Delivery Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deliveryDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input placeholder="e.g. Warehouse A, Main Store" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label>Additional Information (Optional)</Label>
                            <Textarea placeholder="Any special instructions..." value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
                        </div>

                        {priceRange && (
                            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                                <strong>Market Price Range:</strong> ₹{priceRange.minPricePerUnit} – ₹{priceRange.maxPricePerUnit} per {eoq?.unitName}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreatePO} disabled={submitting || !deliveryDate || loadingPrice}>
                            {submitting ? "Creating..." : "Create Purchase Order"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-10 w-96" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                ))}
            </div>
        </div>
    );
}