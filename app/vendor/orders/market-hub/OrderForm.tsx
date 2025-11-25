"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { AddProduct } from "@/app/type";

interface OrderFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  vendorId: string;
  productList: AddProduct[];
  productLoading: boolean;
  productError: string | null;
  onRefresh: () => void;
}

// Extend product type to include fallback prices (add this to your AddProduct type too)
interface ProductWithPrice extends AddProduct {
  fallbackMinPrice?: number;
  fallbackMaxPrice?: number;
}

export default function OrderForm({
  isOpen,
  setIsOpen,
  vendorId,
  productList,
  productLoading,
  productError,
  onRefresh,
}: OrderFormProps) {
  const [formData, setFormData] = useState({
    vendorId,
    productId: "",
    quantity: 0,
    requiredDeliveryDate: new Date().toISOString().split("T")[0],
    location: "",
    priceRangeMin: 0,
    priceRangeMax: 0,
    additionalInfo: "",
  });

  const [quantityInput, setQuantityInput] = useState("");
  const [priceMinDisplay, setPriceMinDisplay] = useState("50.00");
  const [priceMaxDisplay, setPriceMaxDisplay] = useState("200.00");
  const [priceRangeLoading, setPriceRangeLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setFormData({
        vendorId,
        productId: "",
        quantity: 0,
        requiredDeliveryDate: today,
        location: "",
        priceRangeMin: 0,
        priceRangeMax: 0,
        additionalInfo: "",
      });
      setQuantityInput("");
      setError("");
      setPriceMinDisplay("50.00");
      setPriceMaxDisplay("200.00");
    }
  }, [isOpen, vendorId]);

  // When product changes → fetch live price OR use fallback
  useEffect(() => {
    if (formData.productId) {
      const selected = productList.find(p => p.id === formData.productId) as ProductWithPrice | undefined;
      
      if (selected) {
        // Try live market price first
        fetchLivePriceRange(formData.productId, selected);
      }
    } else {
      setPriceMinDisplay("50.00");
      setPriceMaxDisplay("200.00");
      updateFormPrices(50, 200);
    }
  }, [formData.productId, productList]);

  const fetchLivePriceRange = async (productId: string, product: ProductWithPrice) => {
    setPriceRangeLoading(true);
    setPriceMinDisplay("Loading...");
    setPriceMaxDisplay("Loading...");

    try {
      const response = await axiosInstance.get(`/api/v1/marketHub/priceRanges/${productId}`);
      
      if (response.data.isSuccess && response.data.output) {
        const min = Number(response.data.output.minPricePerUnit);
        const max = Number(response.data.output.maxPricePerUnit);

        if (!isNaN(min) && !isNaN(max) && min > 0 && max >= min) {
          const fMin = min.toFixed(2);
          const fMax = max.toFixed(2);
          setPriceMinDisplay(fMin);
          setPriceMaxDisplay(fMax);
          updateFormPrices(min, max);
          setPriceRangeLoading(false);
          return;
        }
      }
    } catch (err) {
      console.log("Live price not available, using fallback");
      // Ignore 404 → use fallback
    }

    // === FALLBACK LOGIC ===
    setPriceRangeLoading(false);

    // 1. Use product-defined fallback (recommended)
    if (product.fallbackMinPrice && product.fallbackMaxPrice) {
      const min = product.fallbackMinPrice;
      const max = product.fallbackMaxPrice;
      setPriceMinDisplay(min.toFixed(2));
      setPriceMaxDisplay(max.toFixed(2));
      updateFormPrices(min, max);
      return;
    }

    // 2. Smart default per category (you can expand this)
    const categoryDefaults: Record<string, { min: number; max: number }> = {
      "Vegetables": { min: 40, max: 180 },
      "Fruits": { min: 60, max: 250 },
      "Grains": { min: 30, max: 120 },
      "Spices": { min: 200, max: 800 },
      "default": { min: 50, max: 300 },
    };

    const catKey = product.categoryName || "default";
    const fallback = categoryDefaults[catKey] || categoryDefaults.default;

    setPriceMinDisplay(fallback.min.toFixed(2));
    setPriceMaxDisplay(fallback.max.toFixed(2));
    updateFormPrices(fallback.min, fallback.max);
  };

  const updateFormPrices = (min: number, max: number) => {
    setFormData(prev => ({
      ...prev,
      priceRangeMin: min,
      priceRangeMax: max,
    }));
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQuantityInput(value);
    handleChange("quantity", parseInt(value) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.productId) return setError("Please select a product.");
    if (formData.quantity <= 0) return setError("Enter valid quantity.");
    if (!formData.location.trim()) return setError("Enter location.");
    if (!formData.requiredDeliveryDate) return setError("Select delivery date.");

    setIsLoading(true);
    try {
      const payload = {
        vendorId: formData.vendorId,
        productId: formData.productId,
        quantity: formData.quantity,
        requiredDeliveryDate: new Date(formData.requiredDeliveryDate).toISOString(),
        location: formData.location.trim(),
        priceRangeMin: formData.priceRangeMin,
        priceRangeMax: formData.priceRangeMax,
        additionalInfo: formData.additionalInfo.trim() || null,
      };

      await axiosInstance.post("/api/v1/marketHub/create", payload);
      setIsOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedProduct = productList.find(p => p.id === formData.productId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Product *</Label>
        <SearchableSelect
          value={formData.productId}
          onChange={(val) => handleChange("productId", val)}
          options={productList.map(p => ({ value: p.id, label: p.name }))}
          placeholder={productLoading ? "Loading..." : "Select a product"}
          emptyMessage="No products available"
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Input value={selectedProduct?.categoryName || ""} readOnly />
      </div>

      <div className="space-y-2">
        <Label>Quantity *</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={quantityInput}
          onChange={handleQuantityChange}
          placeholder="e.g. 500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Required Delivery Date *</Label>
        <Input
          type="date"
          value={formData.requiredDeliveryDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => handleChange("requiredDeliveryDate", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Location *</Label>
        <Input
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="e.g. Colombo"
          required
        />
      </div>

      {/* PRICE RANGE — ALWAYS SHOWS A VALUE */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Price (Rs. per unit)</Label>
          <Input
            value={priceRangeLoading ? "Loading..." : priceMinDisplay}
            readOnly
            className="bg-gray-50 dark:bg-gray-900 font-semibold"
          />
          <p className="text-xs text-muted-foreground">
            {priceRangeLoading ? "Fetching latest price..." : "Expected range"}
          </p>
        </div>
        <div className="space-y-2">
          <Label>Max Price (Rs. per unit)</Label>
          <Input
            value={priceRangeLoading ? "Loading..." : priceMaxDisplay}
            readOnly
            className="bg-gray-50 dark:bg-gray-900 font-semibold"
          />
          <p className="text-xs text-muted-foreground">
            {priceRangeLoading ? "Fetching latest price..." : "Expected range"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Additional Information (Optional)</Label>
        <Textarea
          value={formData.additionalInfo}
          onChange={(e) => handleChange("additionalInfo", e.target.value)}
          placeholder="e.g. Need good quality, urgent..."
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-lg py-6"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </form>
  );
}