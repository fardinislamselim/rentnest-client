import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import RentalRequestDialog from "@/components/property/rental-request-dialog";
import { api } from "@/lib/axios";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Share2,
  Heart,
} from "lucide-react";

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

async function getPropertyDetails(id: string) {
  try {
    const res = await api.get(`/properties/${id}`);
    if (res.data?.success && res.data?.data) {
      return res.data.data;
    }
  } catch (err) {
    console.warn("Failed to fetch property from backend:", err);
  }
  return null;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  const property = await getPropertyDetails(id);

  const title = property?.title || "Modern Rental Property";
  const location = property?.location || "Dhaka, Bangladesh";
  const rawPrice = property?.price ?? 35000;
  const price = rawPrice ? `BDT ${rawPrice.toLocaleString()}` : "BDT 35,000";
  const bedrooms = property?.bedrooms ?? 3;
  const bathrooms = property?.bathrooms ?? 2;
  const area = property?.size || property?.area || 1450;
  const description =
    property?.description ||
    "A well-maintained rental property featuring spacious bedrooms, modern kitchen fittings, 24/7 water and power backup, and close proximity to public transport.";
  const image =
    property?.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-background py-10 lg:py-16">
      <Container>
        {/* Back Link */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <Link href="/properties">
              <ArrowLeft className="h-4 w-4" /> Back to Properties
            </Link>
          </Button>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
              <Image
                src={image}
                alt={title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-sm">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground shadow-sm">
                  <Share2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                    {title}
                  </h1>
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                    {location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {price}
                  </span>
                  <span className="text-xs text-muted-foreground block">/ month</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl border border-border/60 bg-card text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Bed className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Bedrooms</span>
                    <span className="text-sm font-bold text-foreground">{bedrooms} Beds</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Bath className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Bathrooms</span>
                    <span className="text-sm font-bold text-foreground">{bathrooms} Baths</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Maximize className="h-5 w-5 text-blue-500" />
                  <div>
                    <span className="text-xs text-muted-foreground block">Area</span>
                    <span className="text-sm font-bold text-foreground">{area} sqft</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Description
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Key Features */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Key Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 24/7 Security
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Generator Backup
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Parking Available
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Balcony Access
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> High-speed Internet
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Lift Facility
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-xl">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Interested in this home?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contact the landlord directly or request a viewing schedule.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                <RentalRequestDialog
                  propertyId={id}
                  propertyTitle={title}
                  propertyPrice={rawPrice}
                />
                <Button variant="outline" className="w-full rounded-xl py-5">
                  Contact Landlord
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" /> Available Immediately
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Verified Listing
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}