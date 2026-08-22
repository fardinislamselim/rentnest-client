"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteProperty } from "@/hooks/use-delete-property";
import { useState } from "react";

interface LandlordPropertyCardProps {
  property: Property;
  priorityImage?: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function LandlordPropertyCard({
  property,
  priorityImage = false,
}: LandlordPropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.images?.[0] ||
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
  );
  const { deleteProperty, isSubmitting } = useDeleteProperty();

  const categoryName =
    typeof property.category === "object"
      ? property.category.name
      : property.category || "Rental";

  const availabilityLabel =
    property.available === false
      ? "Rented"
      : property.available === true
        ? "Available"
        : "Unavailable";

  const availabilityColor =
    property.available === false
      ? "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
      : property.available === true
        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400"
        : "bg-gray-500/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-400";

  const handleDelete = async () => {
    await deleteProperty(property.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={imgSrc}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priorityImage}
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            )
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-baseline gap-1 rounded-xl bg-background/90 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 shadow-md">
            <span className="text-base font-bold text-foreground">
              {formatCurrency(property.price)}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              /{property.rentPeriod || "mo"}
            </span>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${availabilityColor}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {availabilityLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category */}
        <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
          {categoryName}
        </span>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-foreground line-clamp-1 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">
              {property.bedrooms}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">
              {property.bathrooms}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-foreground">
              {property.area}
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            Listed:{" "}
            {property.createdAt
              ? new Date(property.createdAt).toLocaleDateString("en-BD", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-4 border-t border-border/40">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-border/60 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-400/10 cursor-pointer"
          >
            <Link
              href={`/landlord-dashboard/edit-property/${property.id}`}
              className="flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl border-border/60 text-red-500 hover:bg-red-500/10 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Property?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove &quot;{property.title}&quot; from your
            listings. This action cannot be undone.
          </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  {isSubmitting ? "Deleting..." : "Delete Property"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
