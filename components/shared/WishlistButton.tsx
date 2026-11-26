"use client";

import React from "react";
import { Heart } from "lucide-react";

import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  propertyId: string;
  propertyTitle?: string;
  className?: string;
  iconClassName?: string;
}

export function WishlistButton({
  propertyId,
  propertyTitle,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const { canWishlist, isWishlisted, toggleWishlist } = useWishlist();

  if (!canWishlist) return null;

  const saved = isWishlisted(propertyId);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    void toggleWishlist(propertyId, propertyTitle);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved properties" : "Save property"}
      aria-pressed={saved}
      title={saved ? "Remove from saved properties" : "Save property"}
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90",
        saved
          ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 hover:bg-rose-600"
          : "bg-white/85 text-foreground hover:bg-white dark:bg-zinc-900/80 dark:hover:bg-zinc-800",
        className,
      )}
    >
      <Heart
        className={cn("h-4 w-4", saved && "fill-current", iconClassName)}
        aria-hidden="true"
      />
    </button>
  );
}
