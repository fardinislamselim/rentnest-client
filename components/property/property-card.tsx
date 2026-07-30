"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Bed, Bath, Maximize, Heart, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
  priorityImage?: boolean;
}

export default function PropertyCard({ property, priorityImage = false }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
  );

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    toast.success(
      !isFavorite
        ? `Added "${property.title}" to favorites`
        : `Removed "${property.title}" from favorites`
    );
  };

  const categoryName =
    typeof property.category === "object" ? property.category.name : property.category || "Rental";

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
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          onError={() =>
            setImgSrc("https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80")
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {property.isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white/90">
              {categoryName}
            </span>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={toggleFavorite}
            aria-label="Add to favorite"
            className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-colors duration-200 cursor-pointer ${
              isFavorite
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "bg-white/80 dark:bg-zinc-900/80 text-foreground hover:bg-white dark:hover:bg-zinc-800"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
        </div>

        {/* Price Tag Overlay on Image */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-baseline gap-1 rounded-xl bg-background/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 shadow-md">
            <span className="text-base font-bold text-foreground">{formattedPrice}</span>
            <span className="text-xs text-muted-foreground font-medium">/{property.rentPeriod || "mo"}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div className="flex flex-col gap-2">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {property.title}
          </h3>

          {/* Description snippet if available */}
          {property.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          )}
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/50 text-xs font-medium text-foreground">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bed className="h-4 w-4 text-blue-500 shrink-0" />
            <span><strong className="text-foreground">{property.bedrooms}</strong> Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bath className="h-4 w-4 text-blue-500 shrink-0" />
            <span><strong className="text-foreground">{property.bathrooms}</strong> Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground truncate">
            <Maximize className="h-4 w-4 text-blue-500 shrink-0" />
            <span><strong className="text-foreground">{property.area}</strong> sqft</span>
          </div>
        </div>

        {/* View Details Button */}
        <div className="pt-1">
          <Button
            asChild
            variant="outline"
            className="w-full justify-between rounded-xl border-border/70 group/btn hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 transition-all duration-200 cursor-pointer"
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
