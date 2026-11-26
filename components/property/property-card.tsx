"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bath,
  Bed,
  CheckCircle2,
  MapPin,
  Maximize,
} from "lucide-react";

import { WishlistButton } from "@/components/shared/WishlistButton";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

interface PropertyCardProps {
  property: Property;
  priorityImage?: boolean;
}

export default function PropertyCard({
  property,
  priorityImage = false,
}: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.primaryImage || property.images?.[0] || FALLBACK_IMAGE,
  );

  const categoryName =
    typeof property.category === "object"
      ? property.category.name
      : property.category || "Rental";

  const areaSqft = property.area ?? property.size ?? 0;

  const formattedPrice = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
              {categoryName}
            </span>
          </div>

          <WishlistButton
            propertyId={property.id}
            propertyTitle={property.title}
          />
        </div>

        {/* Price Tag Overlay on Image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-baseline gap-1 rounded-xl bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-md dark:bg-zinc-900/90">
            <span className="text-base font-bold text-foreground">
              {formattedPrice}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              /{property.rentPeriod || "mo"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
            <span className="truncate">{property.location}</span>
          </div>

          <h3 className="font-heading line-clamp-1 text-lg font-bold text-foreground transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {property.title}
          </h3>

          {property.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {property.description}
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 border-y border-border/50 py-3 text-xs font-medium text-foreground">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bed className="h-4 w-4 shrink-0 text-blue-500" />
            <span>
              <strong className="text-foreground">{property.bedrooms}</strong>{" "}
              Beds
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bath className="h-4 w-4 shrink-0 text-blue-500" />
            <span>
              <strong className="text-foreground">{property.bathrooms}</strong>{" "}
              Baths
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate text-muted-foreground">
            <Maximize className="h-4 w-4 shrink-0 text-blue-500" />
            <span>
              <strong className="text-foreground">{areaSqft}</strong> sqft
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-1">
          <Button
            asChild
            variant="outline"
            className="group/btn w-full cursor-pointer justify-between rounded-xl border-border/70 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
          >
            <Link href={`/properties/${property.id}`}>
              <span>View Details</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
