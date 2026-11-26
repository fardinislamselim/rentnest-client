"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useMe } from "@/hooks/use-me";
import { extractApiErrorMessage } from "@/lib/api-error";
import { api, unwrapApiResponse } from "@/lib/axios";
import type { IApiResponse } from "@/types/api";

interface ToggleWishlistResponse {
  wishlisted: boolean;
  propertyId: string;
}

interface WishlistContextValue {
  savedIds: Set<string>;
  isLoading: boolean;
  canWishlist: boolean;
  isWishlisted: (propertyId: string) => boolean;
  toggleWishlist: (
    propertyId: string,
    propertyTitle?: string,
  ) => Promise<boolean>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export const WISHLIST_IDS_QUERY_KEY = ["wishlist-ids"] as const;
export const WISHLIST_LIST_QUERY_KEY = ["wishlist"] as const;

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  const isTenant = user?.role === "TENANT";
  const canWishlist = !user || isTenant;

  const { data: ids = [], isLoading } = useQuery<string[]>({
    queryKey: WISHLIST_IDS_QUERY_KEY,
    queryFn: () =>
      unwrapApiResponse(
        api.get<IApiResponse<string[]>>("/wishlist/ids"),
        "Failed to load saved properties",
      ),
    enabled: isTenant,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const savedIds = useMemo(() => new Set(ids), [ids]);

  const isWishlisted = useCallback(
    (propertyId: string) => savedIds.has(propertyId),
    [savedIds],
  );

  const toggleWishlist = useCallback(
    async (propertyId: string, propertyTitle?: string): Promise<boolean> => {
      if (!user) {
        toast.info("Please sign in as a tenant to save properties.", {
          action: {
            label: "Sign in",
            onClick: () => router.push("/login"),
          },
        });
        return false;
      }

      if (user.role !== "TENANT") {
        toast.error("Only tenant accounts can save properties.");
        return false;
      }

      const previousIds =
        queryClient.getQueryData<string[]>(WISHLIST_IDS_QUERY_KEY) ?? [];
      const wasSaved = previousIds.includes(propertyId);
      const nextIds = wasSaved
        ? previousIds.filter((id) => id !== propertyId)
        : [propertyId, ...previousIds];

      queryClient.setQueryData<string[]>(WISHLIST_IDS_QUERY_KEY, nextIds);

      try {
        const result = await unwrapApiResponse(
          api.post<IApiResponse<ToggleWishlistResponse>>(
            `/wishlist/${propertyId}`,
          ),
          "Could not update saved properties",
        );

        const label = propertyTitle ? `"${propertyTitle}"` : "Property";
        toast.success(
          result.wishlisted
            ? `Added ${label} to saved properties`
            : `Removed ${label} from saved properties`,
        );

        queryClient.invalidateQueries({ queryKey: WISHLIST_LIST_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: WISHLIST_IDS_QUERY_KEY });
        return result.wishlisted;
      } catch (error) {
        queryClient.setQueryData<string[]>(WISHLIST_IDS_QUERY_KEY, previousIds);
        toast.error(
          extractApiErrorMessage(error, "Could not update saved properties."),
        );
        return wasSaved;
      }
    },
    [user, queryClient, router],
  );

  const value = useMemo<WishlistContextValue>(
    () => ({
      savedIds,
      isLoading,
      canWishlist,
      isWishlisted,
      toggleWishlist,
    }),
    [savedIds, isLoading, canWishlist, isWishlisted, toggleWishlist],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
