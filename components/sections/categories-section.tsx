"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Landmark,
  LayoutGrid,
  Briefcase,
  Layers,
  Home,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/layout/container";
import { useCategories } from "@/hooks/use-categories";
import { Skeleton } from "@/components/ui/skeleton";

// Predefined 6 Categories with high-end icons and default count fallbacks
const CATEGORY_META: Record<
  string,
  { icon: React.ElementType; defaultCount: string; color: string }
> = {
  Apartment: {
    icon: Building2,
    defaultCount: "1,420+ Listings",
    color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
  },
  Villa: {
    icon: Landmark,
    defaultCount: "380+ Listings",
    color: "text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20",
  },
  Studio: {
    icon: LayoutGrid,
    defaultCount: "850+ Listings",
    color: "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
  },
  Office: {
    icon: Briefcase,
    defaultCount: "520+ Listings",
    color: "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20",
  },
  Duplex: {
    icon: Layers,
    defaultCount: "290+ Listings",
    color: "text-purple-500 bg-purple-500/10 dark:bg-purple-500/20",
  },
  "Family House": {
    icon: Home,
    defaultCount: "960+ Listings",
    color: "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20",
  },
};

const DEFAULT_CATEGORIES = [
  { id: "cat-apartment", name: "Apartment" },
  { id: "cat-villa", name: "Villa" },
  { id: "cat-studio", name: "Studio" },
  { id: "cat-office", name: "Office" },
  { id: "cat-duplex", name: "Duplex" },
  { id: "cat-family-house", name: "Family House" },
];

export default function CategoriesSection() {
  const { data: apiCategories, isLoading } = useCategories();

  // Combine backend categories or use DEFAULT_CATEGORIES if backend list is empty
  const displayCategories =
    apiCategories && apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES;

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Explore by Type
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Browse Property Categories
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Find the perfect space tailored to your lifestyle and budget across top rental categories.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group cursor-pointer"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/60 bg-card gap-3"
              >
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          /* Cards Grid: 6 cols desktop, 3 cols tablet, 2 cols mobile */
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
          >
            {displayCategories.slice(0, 6).map((category, index) => {
              const meta = CATEGORY_META[category.name] || {
                icon: Home,
                defaultCount: "350+ Listings",
                color: "text-blue-500 bg-blue-500/10 dark:bg-blue-500/20",
              };
              const Icon = meta.icon;

              return (
                <motion.div
                  key={category.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                >
                  <Link
                    href={`/properties?category=${encodeURIComponent(category.name)}`}
                    className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border/60 bg-card hover:bg-card/90 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 cursor-pointer h-full justify-between"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${meta.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <div className="mt-4 flex flex-col items-center">
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {category.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium mt-1">
                        {meta.defaultCount}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
