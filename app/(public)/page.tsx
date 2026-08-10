import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import StatsSection from "@/components/sections/stats-section";
import CategoriesSection from "@/components/sections/categories-section";
import FeaturedPropertiesSection from "@/components/sections/featured-properties-section";
import CTASection from "@/components/sections/cta-section";
import { getMe } from "@/service/getMe";

export const metadata: Metadata = {
  title: "RentNest | Rental Property Marketplace",
  description: "Discover modern apartments, family homes, and rental properties across Bangladesh.",
};

export default function HomePage() {

  getMe()
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Stats Section */}
      <StatsSection />

      {/* 3. Categories Section */}
      <CategoriesSection />

      {/* 4. Featured Properties Section */}
      <FeaturedPropertiesSection />

      {/* 5. Call To Action Section */}
      <CTASection />
    </div>
  );
}
