import { useQuery } from "@tanstack/react-query";

import { adminApi } from "@/lib/admin-api";
import type { AdminProperty } from "@/types/admin";

export interface PropertyIndexEntry {
  id: string;
  title: string;
  location: string;
  price: number;
  status: AdminProperty["status"];
  landlordId: string;
}

const PAGE_SIZE = 100; // `adminPropertyQuerySchema` caps `limit` at 100.
const MAX_PAGES = 20; // Safety stop: 2,000 properties.

/**
 * Full property lookup, keyed by id.
 *
 * `GET /admin/rentals` nests only `{ id, title, location }` for the property and
 * carries no landlord at all, so the rental table's Landlord and Rent columns
 * have to be resolved from somewhere. This walks `GET /admin/properties` (capped
 * at 100 rows per request by the backend schema) and indexes the result.
 */
const fetchPropertyIndex = async (): Promise<Map<string, PropertyIndexEntry>> => {
  const index = new Map<string, PropertyIndexEntry>();

  let page = 1;
  let total = Infinity;

  while (index.size < total && page <= MAX_PAGES) {
    const { data, meta } = await adminApi.get<AdminProperty[]>("/properties", {
      page,
      limit: PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    for (const property of data) {
      index.set(property.id, {
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        status: property.status,
        landlordId: property.landlordId,
      });
    }

    total = meta?.total ?? index.size;

    if (data.length < PAGE_SIZE) break;
    page += 1;
  }

  return index;
};

export const useAdminPropertyIndex = () =>
  useQuery<Map<string, PropertyIndexEntry>, Error>({
    queryKey: ["admin-property-index"],
    queryFn: fetchPropertyIndex,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
  });
