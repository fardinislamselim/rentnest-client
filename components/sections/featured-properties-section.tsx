"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertCircle, Building2, RefreshCw } from "lucide-react";

import Container from "@/components/layout/container";
import { useFeaturedProperties } from "@/hooks/use-featured-properties";
import PropertyCard from "@/components/property/property-card";
import PropertyCardSkeleton from "@/components/property/property-card-skeleton";
import { Button } from "@/components/ui/button";

export default function FeaturedPropertiesSection() {
  const {
    data: properties,
    isLoading,
    isError,
    error,
    refetch,
  } = useFeaturedProperties();

  return (
    <section className="py-16 lg:py-24 bg-muted/20 border-t border-border/40 relative">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Handpicked Homes
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Properties
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Explore our top-rated, handpicked rental listings across major locations.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group cursor-pointer w-fit"
          >
            <Link href="/properties" className="flex items-center gap-2">
              <span>View All Properties</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* 1. Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 2. Error State */}
        {!isLoading && isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-3xl border border-destructive/30 bg-destructive/5 text-center max-w-md mx-auto my-8 gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Something Went Wrong
              </h3>
              <p className="text-sm text-muted-foreground">
                {error?.message || "Unable to load featured properties at this time."}
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-2 rounded-xl border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* 3. Empty State */}
        {!isLoading && !isError && (!properties || properties.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 rounded-3xl border border-border/60 bg-card text-center max-w-md mx-auto my-8 gap-4 shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-heading text-xl font-bold text-foreground">
                No Properties Found
              </h3>
              <p className="text-sm text-muted-foreground">
                There are currently no featured properties available. Check back soon or browse all properties.
              </p>
            </div>
            <Button
              asChild
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer"
            >
              <Link href="/properties">Browse All Rentals</Link>
            </Button>
          </motion.div>
        )}

        {/* 4. Success Grid State: 3 Desktop, 2 Tablet, 1 Mobile */}
        {!isLoading && !isError && properties && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {properties.map((property, idx) => (
              <PropertyCard
                key={property.id}
                property={property}
                priorityImage={idx < 3}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
