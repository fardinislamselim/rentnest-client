import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Bath,
  Bed,
  CheckCircle2,
  MapPin,
  Maximize,
  ShieldCheck,
  Tag,
} from "lucide-react";

import Container from "@/components/layout/container";
import { BookingRequestCard } from "@/components/property/BookingRequestCard";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import {
  PropertyReviewsSection,
  type PropertyReview,
} from "@/components/property/PropertyReviewsSection";
import { SafeHtmlRenderer } from "@/components/shared/SafeHtmlRenderer";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import type { BookedDateRange } from "@/lib/date-range";
import { initialsOf } from "@/lib/format";
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
  const categoryName =
    typeof property.category === "object"
      ? property.category.name
      : property.category || "Rental";
  const formattedPrice = property.price
    ? `BDT ${property.price.toLocaleString()}`
    : "BDT —";

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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Gallery, Details, Host & Reviews */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <PropertyGallery
              propertyId={id}
              title={property.title}
              primaryImage={property.primaryImage}
              images={property.images}
            />

            {/* Title, Short Title & Short Description */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-0 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Tag className="mr-1 h-3 w-3" aria-hidden="true" />
                      {categoryName}
                    </Badge>
                    {property.status ? (
                      <Badge
                        variant="outline"
                        className="border-border/60 text-xs font-medium"
                      >
                        {property.status}
                      </Badge>
                    ) : null}
                  </div>
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
                  {property.shortTitle ? (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {property.shortTitle}
                    </p>
                  ) : null}
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
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

              {property.shortDescription ? (
                <p className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm leading-relaxed text-foreground/90">
                  {property.shortDescription}
                </p>
              ) : null}
            </div>

            {/* Key Specs Bar */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card p-4 text-center sm:text-left">
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                <Bed className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
                <Bath className="h-5 w-5 text-blue-500" aria-hidden="true" />
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
                <Maximize className="h-5 w-5 text-blue-500" aria-hidden="true" />
                <div>
                  <span className="block text-xs text-muted-foreground">
                    Size
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {area > 0 ? `${area} sqft` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sanitized Rich HTML Description */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground">
                About this Property
              </h2>
              <SafeHtmlRenderer html={property.description} />
            </div>

            {/* Landlord Host Card */}
            {property.landlord ? (
              <Link
                href={`/landlords/${property.landlord.id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-blue-500/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border border-border/60">
                    {property.landlord.avatar ? (
                      <AvatarImage
                        src={property.landlord.avatar}
                        alt={property.landlord.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-blue-500/10 text-base font-bold text-blue-600 dark:text-blue-400">
                        {initialsOf(property.landlord.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        Hosted by {property.landlord.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Verified Host
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {property.landlord.bio ||
                        "View host profile and all available listings from this landlord."}
                    </p>
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  View Host Profile
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ) : null}

            {/* Key Features */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Included Highlights
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
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Parking
                  Available
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Balcony
                  Access
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
