import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { Property } from "@/types/property";
import { PropertiesApiResponseData } from "@/hooks/use-properties";

const MOCK_FEATURED_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Luxury Penthouse in Gulshan 2",
    description: "Spacious 3-bedroom penthouse with panoramic lake views, private terrace, and modern smart home features.",
    price: 85000,
    rentPeriod: "month",
    location: "Gulshan 2, Dhaka",
    city: "Dhaka",
    bedrooms: 3,
    bathrooms: 4,
    area: 2800,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Apartment",
    isFeatured: true,
    isVerified: true,
    rating: 4.9,
    reviewsCount: 24,
  },
  {
    id: "prop-2",
    title: "Modern Duplex Villa with Garden",
    description: "Fully furnished duplex villa featuring a private garden, 2-car garage, and 24/7 security in a quiet neighborhood.",
    price: 120000,
    rentPeriod: "month",
    location: "Banani DOHS, Dhaka",
    city: "Dhaka",
    bedrooms: 4,
    bathrooms: 5,
    area: 3600,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Villa",
    isFeatured: true,
    isVerified: true,
    rating: 4.8,
    reviewsCount: 18,
  },
  {
    id: "prop-3",
    title: "Minimalist Studio Apartment",
    description: "Cozy minimalist studio ideal for working professionals. Minutes away from tech hubs and transit options.",
    price: 28000,
    rentPeriod: "month",
    location: "Dhanmondi, Dhaka",
    city: "Dhaka",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Studio",
    isFeatured: true,
    isVerified: true,
    rating: 4.7,
    reviewsCount: 32,
  },
  {
    id: "prop-4",
    title: "Executive Commercial Office Space",
    description: "Ready-to-occupy prime office space with high-speed fiber internet, central air conditioning, and reception service.",
    price: 150000,
    rentPeriod: "month",
    location: "Agrabad, Chattogram",
    city: "Chattogram",
    bedrooms: 0,
    bathrooms: 2,
    area: 2200,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Office",
    isFeatured: true,
    isVerified: true,
    rating: 4.9,
    reviewsCount: 12,
  },
  {
    id: "prop-5",
    title: "Elegant Family Home near Park",
    description: "Beautiful multi-story family home with balcony, updated kitchen, parking, and friendly neighborhood.",
    price: 45000,
    rentPeriod: "month",
    location: "Uttara Sector 7, Dhaka",
    city: "Dhaka",
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Family House",
    isFeatured: true,
    isVerified: true,
    rating: 4.85,
    reviewsCount: 15,
  },
  {
    id: "prop-6",
    title: "Scenic Waterfront Duplex",
    description: "Breath-taking river view duplex apartment with high ceilings, imported fixtures, and dedicated generator backup.",
    price: 95000,
    rentPeriod: "month",
    location: "Zindabazar, Sylhet",
    city: "Sylhet",
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    ],
    category: "Duplex",
    isFeatured: true,
    isVerified: true,
    rating: 4.95,
    reviewsCount: 29,
  },
];

const fetchFeaturedProperties = async (): Promise<Property[]> => {
  try {
    // 1. Try /properties?isFeatured=true
    const response = await api.get<ApiResponse<PropertiesApiResponseData>>("/properties?isFeatured=true");
    if (response.data?.success && response.data?.data) {
      const rawData = response.data.data;
      const list = Array.isArray(rawData)
        ? rawData
        : (rawData && typeof rawData === "object" && ("properties" in rawData || "data" in rawData))
          ? (rawData.properties || rawData.data || [])
          : [];
      if (list.length > 0) return list;
    }

    // 2. If featured filter returns empty, fetch general /properties
    const generalResponse = await api.get<ApiResponse<PropertiesApiResponseData>>("/properties");
    if (generalResponse.data?.success && generalResponse.data?.data) {
      const rawData = generalResponse.data.data;
      const list = Array.isArray(rawData)
        ? rawData
        : (rawData && typeof rawData === "object" && ("properties" in rawData || "data" in rawData))
          ? (rawData.properties || rawData.data || [])
          : [];
      if (list.length > 0) return list;
    }
  } catch (error) {
    console.warn("API /properties fetch failed, using fallback featured properties.", error);
  }

  return MOCK_FEATURED_PROPERTIES;
};

export const useFeaturedProperties = () => {
  return useQuery<Property[], Error>({
    queryKey: ["featured-properties"],
    queryFn: fetchFeaturedProperties,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
