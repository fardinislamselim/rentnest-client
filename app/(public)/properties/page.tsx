import type { Metadata } from "next";
import { Suspense } from "react";
import { Building2 } from "lucide-react";

import Container from "@/components/layout/container";
import PropertyCard from "@/components/property/property-card";
import { PropertyFilterBar } from "@/components/property/PropertyFilterBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { PropertyGridSkeleton } from "@/components/shared/Skeletons";
import type { Category } from "@/hooks/use-categories";
import { api } from "@/lib/axios";
import {
  buildQueryString,
  countActivePropertyFilters,
  parsePropertySearchParams,
} from "@/lib/queryParams";
import type { IApiResponse, PaginationMeta } from "@/types/api";
import type { IProperty } from "@/types/property";

export const metadata: Metadata = {
  title: "Explore Rental Properties | RentNest",
  description:
    "Browse available rental properties across Bangladesh. Filter by location, property category, bedrooms, or budget.",
};

interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_LIMIT = 9;

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const rawParams = await searchParams;
  const parsed = parsePropertySearchParams(rawParams);
  const page = parsed.page ?? 1;
  const limit = parsed.limit ?? DEFAULT_LIMIT;

  const qs = buildQueryString({
    ...parsed,
    page,
    limit,
  });

  const [categoriesRes, propertiesRes] = await Promise.allSettled([
    api.get<IApiResponse<Category[]>>("/categories"),
    api.get<IApiResponse<IProperty[]>>(`/properties${qs ? `?${qs}` : ""}`),
  ]);

  const categories: Category[] =
    categoriesRes.status === "fulfilled" &&
    categoriesRes.value.data?.success &&
    Array.isArray(categoriesRes.value.data.data)
      ? categoriesRes.value.data.data
      : [];

  let properties: IProperty[] = [];
  let meta: PaginationMeta = { page, limit, total: 0, totalPage: 1 };

  if (propertiesRes.status === "fulfilled" && propertiesRes.value.data?.success) {
    const payload = propertiesRes.value.data;
    if (Array.isArray(payload.data)) {
      properties = payload.data;
    }
    if (payload.meta) {
      meta = payload.meta;
    } else {
      meta = { page, limit, total: properties.length, totalPage: 1 };
    }
  }

  const hasActiveFilters = countActivePropertyFilters(parsed) > 0;

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Explore All Properties
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Browse available rentals across Bangladesh. Use the filters below to
            narrow down by location, property type, bedrooms, or budget.
          </p>
        </div>

        <Suspense fallback={null}>
          <PropertyFilterBar categories={categories} initialParams={parsed} />
        </Suspense>

        {properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No properties found"
            description={
              hasActiveFilters
                ? "We couldn't find any properties matching your current filters. Try adjusting or resetting them."
                : "No rental properties are listed right now. Please check back soon."
            }
            actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
            actionHref={hasActiveFilters ? "/properties" : undefined}
          />
        ) : (
          <div className="space-y-8">
            <Suspense fallback={<PropertyGridSkeleton count={6} />}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={{
                      ...property,
                      area: property.area ?? property.size ?? 0,
                    }}
                  />
                ))}
              </div>
            </Suspense>

            {meta.total > meta.limit ? (
              <Suspense fallback={null}>
                <PaginationControls
                  page={meta.page}
                  limit={meta.limit}
                  total={meta.total}
                  totalPage={meta.totalPage}
                  label="properties"
                />
              </Suspense>
            ) : null}
          </div>
        )}
      </Container>
    </div>
  );
}
