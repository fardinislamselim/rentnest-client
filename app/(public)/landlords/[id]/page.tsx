import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import Container from "@/components/layout/container";
import PropertyCard from "@/components/property/property-card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { formatDate, initialsOf } from "@/lib/format";
import type { IApiResponse } from "@/types/api";
import type { IProperty } from "@/types/property";

interface PublicLandlordProfile {
  id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  role: string;
  status: string;
  createdAt: string;
  properties: IProperty[];
  stats: {
    totalProperties: number;
    averageRating: number;
    totalReviews: number;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return {
    title: `Landlord Profile - ${id} | RentNest`,
    description:
      "Explore verified landlord profile and available rental listings on RentNest.",
  };
}

export default async function LandlordPublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let profile: PublicLandlordProfile | null = null;
  try {
    const res = await api.get<IApiResponse<PublicLandlordProfile>>(
      `/user/${id}`,
    );
    if (res.data?.success && res.data.data) {
      profile = res.data.data;
    }
  } catch {
    profile = null;
  }

  if (!profile) {
    notFound();
  }

  const properties = profile.properties ?? [];
  const stats = profile.stats ?? {
    totalProperties: properties.length,
    averageRating: 0,
    totalReviews: 0,
  };

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
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Properties
            </Link>
          </Button>
        </div>

        {/* Landlord Header Banner */}
        <div className="mb-10 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border-2 border-blue-500/20">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-blue-500/10 text-xl font-bold text-blue-600 dark:text-blue-400">
                    {initialsOf(profile.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                    {profile.name}
                  </h1>
                  <Badge className="border-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                    Verified {profile.role}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    Member since {formatDate(profile.createdAt)}
                  </span>
                  {profile.phone ? (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-blue-500" />
                      {profile.phone}
                    </span>
                  ) : null}
                </div>

                {profile.bio ? (
                  <p className="max-w-2xl pt-1 text-sm leading-relaxed text-muted-foreground">
                    {profile.bio}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Aggregate Stats */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-center">
                <p className="font-heading text-2xl font-extrabold text-foreground tabular-nums">
                  {stats.totalProperties}
                </p>
                <p className="text-xs text-muted-foreground">Active Listings</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-center">
                <p className="font-heading flex items-center justify-center gap-1 text-2xl font-extrabold text-foreground tabular-nums">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  {stats.averageRating > 0 ? stats.averageRating : "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.totalReviews}{" "}
                  {stats.totalReviews === 1 ? "Review" : "Reviews"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Landlord's Available Properties */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
              Available Properties ({properties.length})
            </h2>
          </div>

          {properties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No active listings right now"
              description="This landlord currently has no available properties listed. Check back later or explore other rentals."
              actionLabel="Browse All Properties"
              actionHref="/properties"
            />
          ) : (
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
          )}
        </div>
      </Container>
    </div>
  );
}
