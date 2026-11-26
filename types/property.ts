export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export interface IProperty {
  id: string;
  title: string;
  description?: string;
  price: number;
  rentPeriod?: string; // e.g. "month"
  location: string;
  city?: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // sqft
  size?: number | null;
  primaryImage?: string | null;
  images: string[];
  status?: PropertyStatus;
  category?: string | { id: string; name: string };
  categoryId?: string;
  landlordId?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Property = IProperty;
