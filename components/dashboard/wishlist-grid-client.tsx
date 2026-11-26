"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";

import { AdminPagination } from "@/components/admin/admin-pagination";
import PropertyCard from "@/components/property/property-card";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { WISHLIST_LIST_QUERY_KEY } from "@/hooks/useWishlist";
import { api } from "@/lib/axios";
import type { IApiResponse, PaginationMeta } from "@/types/api";
import type { IProperty } from "@/types/property";

export interface WishlistItem {
  id: string;
  propertyId: string;
  createdAt: string;
  property: IProperty;
}

interface WishlistPageData {
  items: WishlistItem[];
  meta?: PaginationMeta;
}

interface WishlistGridClientProps {
  initialItems: WishlistItem[];
  initialMeta?: PaginationMeta;
}

const PAGE_SIZE = 9;

export function WishlistGridClient({
  initialItems,
  initialMeta,
}: WishlistGridClientProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<WishlistPageData>({
    queryKey: [...WISHLIST_LIST_QUERY_KEY, page],
    queryFn: async () => {
      const res = await api.get<IApiResponse<WishlistItem[]>>(
        `/wishlist?page=${page}&limit=${PAGE_SIZE}`,
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to load saved properties");
      }
      return {
        items: res.data.data ?? [],
        meta: res.data.meta,
      };
    },
    initialData:
      page === 1 ? { items: initialItems, meta: initialMeta } : undefined,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  if (isLoading && !data) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const items = data?.items ?? [];
  const meta = data?.meta;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No saved properties yet"
        description="Tap the heart icon on any listing to save homes you love and compare them here later."
        actionLabel="Browse Properties"
        actionHref="/properties"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <PropertyCard
            key={item.id}
            property={{
              ...item.property,
              area: item.property.area ?? item.property.size ?? 0,
            }}
          />
        ))}
      </div>

      {meta && meta.total > meta.limit ? (
        <AdminPagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          onPageChange={setPage}
          label="saved properties"
        />
      ) : null}
    </div>
  );
}
