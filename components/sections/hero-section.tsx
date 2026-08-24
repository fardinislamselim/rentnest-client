"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Home as HomeIcon, Banknote, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (propertyType) params.append("type", propertyType);
    if (budget) params.append("budget", budget);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Background decorative glows */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-900/10 pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-400/5 blur-[120px] dark:bg-indigo-900/5 pointer-events-none animate-pulse duration-[10000ms]" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left z-10">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
              Easy renting across Bangladesh
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground"
            >
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                Perfect Home
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Discover modern apartments, family homes, and rental properties across Bangladesh. Find verified listings with flexible rental terms.
            </motion.p>

            {/* Primary & Secondary Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/15 group cursor-pointer"
              >
                <Link href="/properties" className="flex items-center gap-2">
                  Browse Properties
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-xl cursor-pointer"
              >
                <Link href="/dashboard">Become a Landlord</Link>
              </Button>
            </motion.div>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 w-full max-w-2xl mx-auto lg:mx-0 p-4 sm:p-5 rounded-2xl bg-background/60 dark:bg-zinc-900/40 border border-border/50 backdrop-blur-lg shadow-xl shadow-zinc-100/50 dark:shadow-none"
            >
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                
                {/* Location select */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-foreground cursor-pointer"
                    >
                      <option value="" className="bg-background">All Bangladesh</option>
                      <option value="Dhaka" className="bg-background">Dhaka</option>
                      <option value="Chattogram" className="bg-background">Chattogram</option>
                      <option value="Sylhet" className="bg-background">Sylhet</option>
                      <option value="Khulna" className="bg-background">Khulna</option>
                      <option value="Rajshahi" className="bg-background">Rajshahi</option>
                      <option value="Barishal" className="bg-background">Barishal</option>
                      <option value="Rangpur" className="bg-background">Rangpur</option>
                      <option value="Mymensingh" className="bg-background">Mymensingh</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-r border-t border-transparent border-t-muted-foreground border-4 mt-0.5" />
                  </div>
                </div>

                {/* Property Type select */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <HomeIcon className="h-3.5 w-3.5 text-blue-500" />
                    Property Type
                    {categoriesLoading && (
                      <Loader2 className="h-3 w-3 animate-spin text-blue-400 ml-1" />
                    )}
                  </label>
                  <div className="relative">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      disabled={categoriesLoading}
                      className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="" className="bg-background">
                        All Categories
                      </option>
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.name} className="bg-background">
                            {cat.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Apartment" className="bg-background">Apartment</option>
                          <option value="Villa" className="bg-background">Villa</option>
                          <option value="Studio" className="bg-background">Studio</option>
                          <option value="Office" className="bg-background">Office</option>
                          <option value="Duplex" className="bg-background">Duplex</option>
                          <option value="Family House" className="bg-background">Family House</option>
                        </>
                      )}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-r border-t border-transparent border-t-muted-foreground border-4 mt-0.5" />
                  </div>
                </div>

                {/* Budget select */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-blue-500" />
                    Budget Range
                  </label>
                  <div className="relative">
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-muted/40 hover:bg-muted/60 dark:bg-zinc-950/40 border border-border/60 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none text-foreground cursor-pointer"
                    >
                      <option value="" className="bg-background">Any Budget</option>
                      <option value="0-15000" className="bg-background">Under BDT 15,000</option>
                      <option value="15000-30000" className="bg-background">BDT 15k - 30k</option>
                      <option value="30000-50000" className="bg-background">BDT 30k - 50k</option>
                      <option value="50000+" className="bg-background">BDT 50,000+</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l border-r border-t border-transparent border-t-muted-foreground border-4 mt-0.5" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3 mt-2">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20">
                    <Search className="h-4 w-4" />
                    Search Available Rentals
                  </Button>
                </div>

              </form>
            </motion.div>
          </div>

          {/* Right Column: Premium Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-none aspect-square group"
            >
              {/* Outer decorative glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 dark:from-blue-400/10 dark:to-indigo-400/5 blur-xl group-hover:scale-105 transition-transform duration-700 pointer-events-none" />

              {/* Decorative dotted grids */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:12px_12px] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] opacity-60 pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[radial-gradient(#e2e8f0_2px,transparent_2px)] [background-size:12px_12px] dark:bg-[radial-gradient(#334155_2px,transparent_2px)] opacity-60 pointer-events-none" />

              {/* Glass image container */}
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted/20 dark:bg-zinc-900/10 p-2.5 shadow-2xl backdrop-blur-sm group-hover:border-blue-500/30 transition-colors duration-500">
                <Image
                  src="/hero-illustration.png"
                  alt="Modern Luxury Home illustration"
                  width={500}
                  height={500}
                  priority
                  className="rounded-2xl w-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Floating badge 1: Verified listings */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -right-6 bg-white dark:bg-zinc-900 border border-border rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                  <svg className="h-4 w-4 fill-green-500/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Properties</span>
                  <span className="text-xs font-bold text-foreground">100% Verified</span>
                </div>
              </motion.div>

              {/* Floating badge 2: Active rentals count */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-10 -left-6 bg-white dark:bg-zinc-900 border border-border rounded-2xl p-3 shadow-lg flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                  <svg className="h-4 w-4 fill-blue-500/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Listings</span>
                  <span className="text-xs font-bold text-foreground">2,500+ Rentals</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  );
}
