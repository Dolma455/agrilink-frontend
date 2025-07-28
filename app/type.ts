export interface UserProps {
    name: any;
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