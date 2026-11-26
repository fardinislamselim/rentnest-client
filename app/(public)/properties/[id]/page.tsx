import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  Bed,
  CheckCircle2,
  MapPin,
  Maximize,
} from "lucide-react";

import Container from "@/components/layout/container";
import { BookingRequestCard } from "@/components/property/BookingRequestCard";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import {
  PropertyReviewsSection,
  type PropertyReview,
} from "@/components/property/PropertyReviewsSection";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import type { BookedDateRange } from "@/lib/date-range";
import type { IApiResponse } from "@/types/api";
import type { IProperty } from "@/types/property";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  return {
    title: `Property Details - ${id} | RentNest`,
    description: "View detailed property information on RentNest.",
  };
}

async function getPropertyPageData(id: string) {
  const [propertyRes, bookedDatesRes, reviewsRes] = await Promise.allSettled([
    api.get<IApiResponse<IProperty>>(`/properties/${id}`),
    api.get<IApiResponse<BookedDateRange[]>>(`/properties/${id}/booked-dates`),
    api.get<IApiResponse<PropertyReview[]>>(`/reviews/properties/${id}`),
  ]);

  const property =
    propertyRes.status === "fulfilled" &&
    propertyRes.value.data?.success &&
    propertyRes.value.data.data
      ? propertyRes.value.data.data
      : null;

  const bookedDates =
    bookedDatesRes.status === "fulfilled" &&
    bookedDatesRes.value.data?.success &&
    Array.isArray(bookedDatesRes.value.data.data)
      ? bookedDatesRes.value.data.data
      : [];

  const reviews =
    reviewsRes.status === "fulfilled" &&
    reviewsRes.value.data?.success &&
    Array.isArray(reviewsRes.value.data.data)
      ? reviewsRes.value.data.data
      : [];

  return { property, bookedDates, reviews };
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;
  const { property, bookedDates, reviews } = await getPropertyPageData(id);

  if (!property) {
    return (
      <div className="min-h-screen bg-background py-10 lg:py-16">
        <Container>
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4" /> Back to Properties
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="font-heading mb-2 text-2xl font-bold text-foreground">
              Property Not Found
            </h2>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              The property you&apos;re looking for could not be found or has
              been removed.
            </p>
            <Button
              asChild
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/properties">Browse All Properties</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const area = property.size || property.area || 0;
  const description =
    property.description || "No description available for this property.";
  const formattedPrice = property.price
    ? `BDT ${property.price.toLocaleString()}`
    : "BDT —";

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        {/* Back Link */}
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" /> Back to Properties
            </Link>
          </Button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Gallery, Details & Reviews */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <PropertyGallery
              propertyId={id}
              title={property.title}
              primaryImage={property.primaryImage}
              images={property.images}
            />

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                      {property.title}
                    </h1>
                    <WishlistButton
                      propertyId={id}
                      propertyTitle={property.title}
                      className="border border-border/60"
                    />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                    {property.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-2xl font-extrabold text-blue-600 dark:text-blue-400 sm:text-3xl">
                    {formattedPrice}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    / month
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card p-4 text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Bed className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Bedrooms
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {property.bedrooms} Beds
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Bath className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Bathrooms
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {property.bathrooms} Baths
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Maximize className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Area
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {area} sqft
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Key Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 sm:text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 24/7
                    Security
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                    Generator Backup
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                    Parking Available
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                    Balcony Access
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                    High-speed Internet
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Lift
                    Facility
                  </div>
                </div>
              </div>

              {/* Verified-Only Reviews */}
              <PropertyReviewsSection
                propertyId={id}
                initialReviews={reviews}
              />
            </div>
          </div>

          {/* Right Column: Booking Request & Booked Dates Calendar */}
          <div className="lg:col-span-4">
            <BookingRequestCard
              propertyId={id}
              propertyTitle={property.title}
              propertyPrice={property.price}
              propertyStatus={property.status}
              bookedDates={bookedDates}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
