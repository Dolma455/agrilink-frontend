export interface UserProps {
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