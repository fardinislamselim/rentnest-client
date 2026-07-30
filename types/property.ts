export interface Property {
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
  images: string[];
  category?: string | { id: string; name: string };
  isFeatured?: boolean;
  isVerified?: boolean;
  rating?: number;
  reviewsCount?: number;
  available?: boolean;
  createdAt?: string;
}
