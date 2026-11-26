"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Check, Loader2 } from "lucide-react";

import { MultiImageUpload } from "@/components/shared/MultiImageUpload";
import { SingleImageUpload } from "@/components/shared/ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";
import type { IProperty, PropertyStatus } from "@/types/property";

interface PropertyFormValues {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  status: PropertyStatus;
}

export interface PropertyFormSubmitData {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  status: PropertyStatus;
  categoryId: string;
  images: string[];
  primaryImageFile: File | null;
  imageFiles: File[];
}

interface PropertyFormProps {
  mode: "create" | "edit";
  initialProperty?: IProperty;
  isSubmitting: boolean;
  onSubmitProperty: (data: PropertyFormSubmitData) => Promise<boolean>;
}

const AMENITIES_LIST = [
  "WiFi",
  "Parking",
  "Swimming Pool",
  "Security",
  "Generator",
  "Lift",
  "Balcony",
  "Garden",
  "Gym",
  "Air Conditioning",
  "Laundry",
  "Cable TV",
];

const AMENITIES_SECTION_REGEX = /\n\nAmenities:\n([\s\S]*)$/;

function parseAmenitiesFromDescription(description: string): string[] {
  const match = description.match(AMENITIES_SECTION_REGEX);
  if (!match) return [];
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^- /, "").trim())
    .filter(Boolean);
}

function stripAmenitiesFromDescription(description: string): string {
  return description.replace(AMENITIES_SECTION_REGEX, "").trim();
}

export function PropertyForm({
  mode,
  initialProperty,
  isSubmitting,
  onSubmitProperty,
}: PropertyFormProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(() =>
    initialProperty?.description
      ? parseAmenitiesFromDescription(initialProperty.description)
      : [],
  );
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [existingPrimaryImage, setExistingPrimaryImage] = useState<
    string | null
  >(() => initialProperty?.primaryImage ?? null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    () =>
      initialProperty?.images?.filter((img) => img && img.trim() !== "") ?? [],
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      location: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    if (!initialProperty) return;

    const cleanDescription = stripAmenitiesFromDescription(
      initialProperty.description || "",
    );
    const categoryId =
      initialProperty.categoryId ||
      (typeof initialProperty.category === "object"
        ? initialProperty.category.id
        : initialProperty.category || "");
    const status: PropertyStatus =
      initialProperty.status ??
      (initialProperty.available === false ? "RENTED" : "AVAILABLE");
    const sizeVal = initialProperty.size ?? initialProperty.area;

    setSelectedAmenities(
      parseAmenitiesFromDescription(initialProperty.description || ""),
    );
    setExistingPrimaryImage(initialProperty.primaryImage ?? null);
    setExistingGalleryUrls(
      initialProperty.images?.filter((img) => img && img.trim() !== "") ?? [],
    );

    reset({
      title: initialProperty.title || "",
      description: cleanDescription,
      categoryId,
      location: initialProperty.location || "",
      price: initialProperty.price ? String(initialProperty.price) : "",
      bedrooms: initialProperty.bedrooms
        ? String(initialProperty.bedrooms)
        : "",
      bathrooms: initialProperty.bathrooms
        ? String(initialProperty.bathrooms)
        : "",
      size: sizeVal ? String(sizeVal) : "",
      status,
    });
  }, [initialProperty, reset]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  const onSubmit = async (data: PropertyFormValues) => {
    const amenitiesText =
      selectedAmenities.length > 0
        ? `\n\nAmenities:\n${selectedAmenities.map((a) => `- ${a}`).join("\n")}`
        : "";

    const ok = await onSubmitProperty({
      title: data.title,
      description: data.description + amenitiesText,
      location: data.location,
      price: parseFloat(data.price),
      bedrooms: parseInt(data.bedrooms, 10),
      bathrooms: parseInt(data.bathrooms, 10),
      size: data.size ? parseInt(data.size, 10) : undefined,
      status: data.status,
      categoryId: data.categoryId,
      images: existingGalleryUrls,
      primaryImageFile,
      imageFiles: galleryFiles,
    });

    if (ok && mode === "create") {
      reset();
      setSelectedAmenities([]);
      setPrimaryImageFile(null);
      setExistingPrimaryImage(null);
      setExistingGalleryUrls([]);
      setGalleryFiles([]);
    }
  };

  const totalImagesCount =
    (primaryImageFile || existingPrimaryImage ? 1 : 0) +
    existingGalleryUrls.length +
    galleryFiles.length;

  const isEdit = mode === "edit";

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Link
          href={
            isEdit
              ? "/landlord-dashboard/my-properties"
              : "/landlord-dashboard"
          }
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {isEdit ? "Back to My Properties" : "Back to Dashboard"}
        </Link>
        <div className="mt-2 flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isEdit ? "Edit Property" : "Create New Property"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {isEdit
              ? "Update your property listing details, images, and availability."
              : "Fill in the details below to list your property for rent."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Main Form */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl dark:bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">
                    Property Title <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Modern 2 Bedroom Apartment"
                    {...register("title", {
                      required: "Property title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                    })}
                    className={
                      errors.title
                        ? "border-rose-500 focus-visible:ring-rose-500/20"
                        : ""
                    }
                  />
                  {errors.title && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="description">
                    Description <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, features, and surroundings..."
                    rows={5}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 10,
                        message: "Description must be at least 10 characters",
                      },
                    })}
                    className={
                      errors.description
                        ? "border-rose-500 focus-visible:ring-rose-500/20"
                        : ""
                    }
                  />
                  {errors.description && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="categoryId">
                      Property Type <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: "Property type is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={categoriesLoading}
                        >
                          <SelectTrigger
                            className={
                              errors.categoryId
                                ? "border-rose-500 focus-visible:ring-rose-500/20"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.categoryId && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="location">
                      Location <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g. Dhaka, Banani"
                      {...register("location", {
                        required: "Location is required",
                        minLength: {
                          value: 3,
                          message: "Location must be at least 3 characters",
                        },
                      })}
                      className={
                        errors.location
                          ? "border-rose-500 focus-visible:ring-rose-500/20"
                          : ""
                      }
                    />
                    {errors.location && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Details */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl dark:bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-lg">Pricing & Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="price">
                      Monthly Rent (BDT) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="15000"
                      {...register("price", {
                        required: "Monthly rent is required",
                        min: {
                          value: 1,
                          message: "Rent must be positive",
                        },
                      })}
                      className={
                        errors.price
                          ? "border-rose-500 focus-visible:ring-rose-500/20"
                          : ""
                      }
                    />
                    {errors.price && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bedrooms">
                      Bedrooms <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="2"
                      {...register("bedrooms", {
                        required: "Bedrooms is required",
                        min: {
                          value: 1,
                          message: "Bedrooms must be at least 1",
                        },
                      })}
                      className={
                        errors.bedrooms
                          ? "border-rose-500 focus-visible:ring-rose-500/20"
                          : ""
                      }
                    />
                    {errors.bedrooms && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.bedrooms.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bathrooms">
                      Bathrooms <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="2"
                      {...register("bathrooms", {
                        required: "Bathrooms is required",
                        min: {
                          value: 1,
                          message: "Bathrooms must be at least 1",
                        },
                      })}
                      className={
                        errors.bathrooms
                          ? "border-rose-500 focus-visible:ring-rose-500/20"
                          : ""
                      }
                    />
                    {errors.bathrooms && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.bathrooms.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="size">Square Feet (optional)</Label>
                    <Input
                      id="size"
                      type="number"
                      placeholder="1200"
                      {...register("size", {
                        min: {
                          value: 1,
                          message: "Size must be positive",
                        },
                      })}
                      className={
                        errors.size
                          ? "border-rose-500 focus-visible:ring-rose-500/20"
                          : ""
                      }
                    />
                    {errors.size && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.size.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="status">Availability</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="RENTED">Rented</SelectItem>
                          <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl dark:bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AMENITIES_LIST.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border border-border/60 px-4 py-3 text-sm font-medium transition-all duration-200",
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                            : "bg-muted/40 text-foreground hover:bg-muted/80",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            isSelected
                              ? "border-white bg-white text-blue-600"
                              : "border-border/60",
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Property Images */}
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl dark:bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-lg">Property Media</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Primary Cover Image</Label>
                  <SingleImageUpload
                    value={primaryImageFile ?? existingPrimaryImage}
                    onChange={(file) => setPrimaryImageFile(file)}
                    onRemoveExisting={() => setExistingPrimaryImage(null)}
                    disabled={isSubmitting}
                    label="Choose cover image"
                    hint="Shown as the main listing thumbnail. JPEG, PNG, WebP or AVIF up to 5 MB."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Gallery Images (up to 8)</Label>
                  <MultiImageUpload
                    existingUrls={existingGalleryUrls}
                    files={galleryFiles}
                    onExistingUrlsChange={setExistingGalleryUrls}
                    onFilesChange={setGalleryFiles}
                    maxFiles={8}
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary & Submit */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/60 bg-card/80 backdrop-blur-xl dark:bg-zinc-900/80">
              <CardHeader>
                <CardTitle className="text-lg">Property Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border/40 py-3">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-auto w-auto border-0 bg-transparent p-0">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="RENTED">Rented</SelectItem>
                          <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between border-b border-border/40 py-3">
                  <span className="text-sm text-muted-foreground">Images</span>
                  <span className="text-sm font-medium text-foreground">
                    {totalImagesCount} image(s)
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/40 py-3">
                  <span className="text-sm text-muted-foreground">
                    Amenities
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedAmenities.length} selected
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 py-5 font-semibold text-white hover:bg-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isEdit ? "Updating Property..." : "Creating Property..."}
                </div>
              ) : isEdit ? (
                "Update Property"
              ) : (
                "Create Property"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
