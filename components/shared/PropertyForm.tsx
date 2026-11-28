"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import {
  ArrowLeft,
  Bath,
  Bed,
  ImageIcon,
  Loader2,
  MapPin,
  Maximize,
  Sparkles,
} from "lucide-react";

import { MultiImageUpload } from "@/components/shared/MultiImageUpload";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { SingleImageUpload } from "@/components/shared/ImageUpload";
import { Badge } from "@/components/ui/badge";
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
import { useCategories, type Category } from "@/hooks/use-categories";
import { stripHtmlTags } from "@/lib/sanitizeHtml";
import type { IProperty, PropertyStatus } from "@/types/property";

interface PropertyFormValues {
  title: string;
  shortTitle: string;
  shortDescription: string;
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
  shortTitle?: string;
  shortDescription?: string;
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
  categories?: Category[];
  initialProperty?: IProperty;
  isSubmitting: boolean;
  onSubmitProperty: (data: PropertyFormSubmitData) => Promise<boolean>;
}

const SHORT_DESC_MAX = 220;
const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

export function PropertyForm({
  mode,
  categories: serverCategories,
  initialProperty,
  isSubmitting,
  onSubmitProperty,
}: PropertyFormProps) {
  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null);
  const [existingPrimaryImage, setExistingPrimaryImage] = useState<
    string | null
  >(() => initialProperty?.primaryImage ?? null);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(
    () =>
      initialProperty?.images?.filter((img) => img && img.trim() !== "") ?? [],
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const { data: fetchedCategories, isLoading: categoriesLoading } =
    useCategories();
  const categories =
    serverCategories && serverCategories.length > 0
      ? serverCategories
      : (fetchedCategories ?? []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    defaultValues: {
      title: initialProperty?.title ?? "",
      shortTitle: initialProperty?.shortTitle ?? "",
      shortDescription: initialProperty?.shortDescription ?? "",
      description: initialProperty?.description ?? "",
      categoryId:
        initialProperty?.categoryId ??
        (typeof initialProperty?.category === "object"
          ? initialProperty.category.id
          : ""),
      location: initialProperty?.location ?? "",
      price: initialProperty?.price ? String(initialProperty.price) : "",
      bedrooms: initialProperty?.bedrooms
        ? String(initialProperty.bedrooms)
        : "",
      bathrooms: initialProperty?.bathrooms
        ? String(initialProperty.bathrooms)
        : "",
      size:
        (initialProperty?.size ?? initialProperty?.area)
          ? String(initialProperty?.size ?? initialProperty?.area)
          : "",
      status: initialProperty?.status ?? "AVAILABLE",
    },
  });

  useEffect(() => {
    if (!initialProperty) return;

    const categoryId =
      initialProperty.categoryId ||
      (typeof initialProperty.category === "object"
        ? initialProperty.category.id
        : initialProperty.category || "");
    const status: PropertyStatus =
      initialProperty.status ??
      (initialProperty.available === false ? "RENTED" : "AVAILABLE");
    const sizeVal = initialProperty.size ?? initialProperty.area;

    setExistingPrimaryImage(initialProperty.primaryImage ?? null);
    setExistingGalleryUrls(
      initialProperty.images?.filter((img) => img && img.trim() !== "") ?? [],
    );

    reset({
      title: initialProperty.title || "",
      shortTitle: initialProperty.shortTitle || "",
      shortDescription: initialProperty.shortDescription || "",
      description: initialProperty.description || "",
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

  const watched = watch();

  const liveCoverUrl = useMemo(() => {
    if (primaryImageFile) return URL.createObjectURL(primaryImageFile);
    return existingPrimaryImage || existingGalleryUrls[0] || FALLBACK_COVER;
  }, [primaryImageFile, existingPrimaryImage, existingGalleryUrls]);

  useEffect(() => {
    return () => {
      if (primaryImageFile && liveCoverUrl.startsWith("blob:")) {
        URL.revokeObjectURL(liveCoverUrl);
      }
    };
  }, [primaryImageFile, liveCoverUrl]);

  const selectedCategoryName =
    categories.find((c) => c.id === watched.categoryId)?.name ?? "Rental";

  const onSubmit = async (data: PropertyFormValues) => {
    const ok = await onSubmitProperty({
      title: data.title.trim(),
      shortTitle: data.shortTitle.trim() || undefined,
      shortDescription: data.shortDescription.trim() || undefined,
      description: data.description,
      location: data.location.trim(),
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
      setPrimaryImageFile(null);
      setExistingPrimaryImage(null);
      setExistingGalleryUrls([]);
      setGalleryFiles([]);
    }
  };

  const isEdit = mode === "edit";
  const shortDescLength = (watched.shortDescription ?? "").length;
  const formattedLivePrice =
    watched.price && !Number.isNaN(Number(watched.price))
      ? `BDT ${Number(watched.price).toLocaleString()}`
      : "BDT —";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
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
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {isEdit ? "Back to My Properties" : "Back to Dashboard"}
        </Link>
        <div className="mt-2 flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isEdit ? "Edit Property Listing" : "Create New Property"}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            {isEdit
              ? "Update listing details, rich description, pricing, and property photos."
              : "Complete all sections below to publish your property on RentNest."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: 4 Structured Sections */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* Section 1: Basic Information */}
            <Card className="border-border/60 bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg">1. Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">
                    Property Title <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Modern 3-Bedroom Apartment in Banani"
                    {...register("title", {
                      required: "Property title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                    })}
                    className={errors.title ? "border-rose-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="shortTitle">
                    Short Title / Tagline{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="shortTitle"
                    maxLength={150}
                    placeholder="e.g. Sunlit 3-Bed Corner Apartment with Balcony"
                    {...register("shortTitle", {
                      maxLength: {
                        value: 150,
                        message: "Short title must be at most 150 characters",
                      },
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="categoryId">
                      Category <span className="text-rose-500">*</span>
                    </Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={
                            categoriesLoading && categories.length === 0
                          }
                        >
                          <SelectTrigger
                            className={
                              errors.categoryId ? "border-rose-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
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
                    <Label htmlFor="status">Listing Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="UNAVAILABLE">
                              Unavailable
                            </SelectItem>
                            {isEdit ? (
                              <SelectItem value="RENTED">Rented</SelectItem>
                            ) : null}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shortDescription">
                      Short Description{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (for cards &amp; search previews)
                      </span>
                    </Label>
                    <span
                      className={`text-xs tabular-nums ${
                        shortDescLength > SHORT_DESC_MAX
                          ? "font-semibold text-rose-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {shortDescLength}/{SHORT_DESC_MAX}
                    </span>
                  </div>
                  <Textarea
                    id="shortDescription"
                    rows={3}
                    maxLength={SHORT_DESC_MAX}
                    placeholder="Concise plain-text summary highlighting the best features of this home..."
                    {...register("shortDescription", {
                      maxLength: {
                        value: SHORT_DESC_MAX,
                        message: `Short description must be at most ${SHORT_DESC_MAX} characters`,
                      },
                    })}
                  />
                  {errors.shortDescription && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.shortDescription.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Detailed Property Description (Rich HTML) */}
            <Card className="border-border/60 bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg">
                  2. Detailed Property Description
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pt-5">
                <Label>
                  Full Description (Rich HTML){" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    validate: (val) => {
                      const plain = stripHtmlTags(val || "");
                      if (plain.length < 10) {
                        return "Full description must be at least 10 characters";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      error={Boolean(errors.description)}
                    />
                  )}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-rose-500">
                    {errors.description.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Section 3: Location, Pricing & Specifications */}
            <Card className="border-border/60 bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg">
                  3. Location, Pricing &amp; Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location">
                    Location / Address <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Road 11, Banani, Dhaka"
                    {...register("location", {
                      required: "Location is required",
                      minLength: {
                        value: 3,
                        message: "Location must be at least 3 characters",
                      },
                    })}
                    className={errors.location ? "border-rose-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-xs font-medium text-rose-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="price">
                      Monthly Rent (BDT) <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min={1}
                      placeholder="25000"
                      {...register("price", {
                        required: "Monthly rent is required",
                        min: { value: 1, message: "Rent must be positive" },
                      })}
                      className={errors.price ? "border-rose-500" : ""}
                    />
                    {errors.price && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="size">Property Size (sq ft)</Label>
                    <Input
                      id="size"
                      type="number"
                      min={1}
                      placeholder="1450"
                      {...register("size", {
                        min: { value: 1, message: "Size must be positive" },
                      })}
                      className={errors.size ? "border-rose-500" : ""}
                    />
                    {errors.size && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.size.message}
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
                      min={1}
                      placeholder="3"
                      {...register("bedrooms", {
                        required: "Bedrooms count is required",
                        min: {
                          value: 1,
                          message: "Bedrooms must be at least 1",
                        },
                      })}
                      className={errors.bedrooms ? "border-rose-500" : ""}
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
                      min={1}
                      placeholder="2"
                      {...register("bathrooms", {
                        required: "Bathrooms count is required",
                        min: {
                          value: 1,
                          message: "Bathrooms must be at least 1",
                        },
                      })}
                      className={errors.bathrooms ? "border-rose-500" : ""}
                    />
                    {errors.bathrooms && (
                      <p className="text-xs font-medium text-rose-500">
                        {errors.bathrooms.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Property Media */}
            <Card className="border-border/60 bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ImageIcon
                    className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  4. Property Media
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 pt-5">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Label>Primary Cover Image</Label>
                    <Badge className="border-0 bg-blue-500/10 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Main Hero Cover
                    </Badge>
                  </div>
                  <SingleImageUpload
                    value={primaryImageFile ?? existingPrimaryImage}
                    onChange={(file) => setPrimaryImageFile(file)}
                    onRemoveExisting={() => setExistingPrimaryImage(null)}
                    disabled={isSubmitting}
                    label="Choose cover image"
                    hint="Displayed as the main hero & card thumbnail. JPEG, PNG, WebP or AVIF up to 5 MB."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Additional Gallery Images (up to 8)</Label>
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

          {/* Right Column: Live Listing Preview Card + Submit */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 flex flex-col gap-5">
              <Card className="overflow-hidden border-border/60 bg-card shadow-md">
                <CardHeader className="border-b border-border/40 pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles
                      className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    Live Listing Preview
                  </CardTitle>
                </CardHeader>
                <div className="relative aspect-[16/10] w-full bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={liveCoverUrl}
                    alt="Live property preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15" />
                  <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    {selectedCategoryName}
                  </span>
                  <div className="absolute bottom-3 left-3 rounded-xl bg-background/90 px-3 py-1 text-sm font-bold text-foreground backdrop-blur-md">
                    {formattedLivePrice}
                    <span className="text-xs font-normal text-muted-foreground">
                      /mo
                    </span>
                  </div>
                </div>
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <span className="truncate">
                      {watched.location || "Location preview"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading line-clamp-1 text-base font-bold text-foreground">
                      {watched.title || "Your Property Title"}
                    </h3>
                    {watched.shortTitle ? (
                      <p className="line-clamp-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {watched.shortTitle}
                      </p>
                    ) : null}
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {watched.shortDescription ||
                      stripHtmlTags(watched.description || "") ||
                      "Your concise summary will appear here on search and property cards."}
                  </p>
                  <div className="grid grid-cols-3 gap-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3.5 w-3.5 text-blue-500" />
                      {watched.bedrooms || "—"} Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3.5 w-3.5 text-blue-500" />
                      {watched.bathrooms || "—"} Baths
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <Maximize className="h-3.5 w-3.5 text-blue-500" />
                      {watched.size || "—"} sqft
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-blue-600 py-6 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    {isEdit ? "Saving Changes..." : "Publishing Listing..."}
                  </span>
                ) : isEdit ? (
                  "Save Property Changes"
                ) : (
                  "Publish Property Listing"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
