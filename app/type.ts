export interface UserProps {
    name: string;
    id: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    role: string;
    businessName: string;
    status: string;
    profilePicture: File | null;

}

export interface UnitProps {
  id: string;
  name: string;
  symbol: string;
}

export interface CategoryProps {
    id:string;
    name: string;
    description: string;
}

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryName: string;
  unitName: string;
}

export interface ProductFormProps {
  name: string;
  description: string;
  imageUrl?: string;
  categoryId: string;
  unitId: string;
  createdBy: string;
}

export interface FarmerProductProps {
  id: string;
  farmerId: string;
  productName: string;
  unit: string;
  imageUrl: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  status: "Available" | "Sold Out";
  isTrending: boolean;
  availableFrom: string;
  lastUpdated: string;
}

export interface FarmerProductFormProps {
  farmerId: string;
  productId: string;
  quantity: number;
  pricePerUnit: number;
  availableFrom: string;
  description: string;
}

export interface AddProduct {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryName: string;
  unitName: string;
}
