export type PropertyStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";

export interface PropertyLandlordSummary {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  phone?: string | null;
  role?: string;
  createdAt?: string;
}

export interface PropertyReviewSummary {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  tenant?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface IProperty {
  id: string;
  title: string;
  shortTitle?: string | null;
  shortDescription?: string | null;
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
  landlord?: PropertyLandlordSummary;
  reviews?: PropertyReviewSummary[];
  isFeatured?: boolean;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Property = IProperty;
