"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Share2 } from "lucide-react";
import { toast } from "sonner";

import { WishlistButton } from "@/components/shared/WishlistButton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

interface PropertyGalleryProps {
  propertyId: string;
  title: string;
  primaryImage?: string | null;
  images?: string[];
}

export function PropertyGallery({
  propertyId,
  title,
  primaryImage,
  images = [],
}: PropertyGalleryProps) {
  const gallery = useMemo(() => {
    const combined = [primaryImage, ...images].filter(
      (src): src is string => Boolean(src && src.trim() !== ""),
    );
    const unique = Array.from(new Set(combined));
    return unique.length > 0 ? unique : [FALLBACK_IMAGE];
  }, [primaryImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = gallery[activeIndex] ?? gallery[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Property link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="space-y-3">
      {/* Hero Image */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="cursor-pointer object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          onClick={() => setLightboxOpen(true)}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />

        {/* Top-right actions */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <WishlistButton
            propertyId={propertyId}
            propertyTitle={title}
            className="h-10 w-10 shadow-sm"
            iconClassName="h-5 w-5"
          />
          <button
            type="button"
            onClick={() => void handleShare()}
            aria-label="Share property"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background"
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Lightbox trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute right-4 bottom-4 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-background/85 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-background"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          {gallery.length > 1
            ? `View all ${gallery.length} photos`
            : "Expand photo"}
        </button>

        {gallery.length > 1 ? (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-background"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute top-1/2 right-3 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-background"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {gallery.length > 1 ? (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {gallery.map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View photo ${index + 1}`}
                className={cn(
                  "relative h-20 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-muted transition-all",
                  isActive
                    ? "border-blue-600 ring-2 ring-blue-600/20"
                    : "border-transparent opacity-75 hover:opacity-100",
                )}
              >
                <Image
                  src={src}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl border-border/60 bg-background/95 p-3 sm:p-4">
          <DialogTitle className="sr-only">{title} gallery</DialogTitle>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={activeImage}
              alt={`${title} full view ${activeIndex + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />

            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground shadow-md hover:bg-background"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground shadow-md hover:bg-background"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <p className="text-center text-xs text-muted-foreground">
              Photo {activeIndex + 1} of {gallery.length}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
