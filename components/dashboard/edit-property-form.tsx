"use client";

import React, { useEffect, useReducer } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Upload, Check, ArrowLeft, Loader2, FileText } from "lucide-react";
import { useProperty } from "@/hooks/use-property";
import { useUpdateProperty } from "@/hooks/use-update-property";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface FormData {
  title: string;
  description: string;
  categoryId: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  status: "AVAILABLE" | "RENTED" | "UNAVAILABLE";
  imageUrls: string;
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

interface PropertyState {
  selectedAmenities: string[];
  imageUrls: string[];
  imagePreview: string[];
  imageFiles: File[];
}

type PropertyAction =
  | { type: "init"; amenities: string[]; imageUrls: string[] }
  | { type: "toggleAmenity"; amenity: string }
  | { type: "addImageUrl"; url: string }
  | { type: "removeImageUrl"; index: number }
  | { type: "addImageFiles"; files: File[]; previews: string[] }
  | { type: "removeImage"; index: number };

function propertyReducer(state: PropertyState, action: PropertyAction): PropertyState {
  switch (action.type) {
    case "init":
      return {
        selectedAmenities: action.amenities,
        imageUrls: action.imageUrls,
        imagePreview: action.imageUrls,
        imageFiles: [],
      };
    case "toggleAmenity":
      return {
        ...state,
        selectedAmenities: state.selectedAmenities.includes(action.amenity)
          ? state.selectedAmenities.filter((a) => a !== action.amenity)
          : [...state.selectedAmenities, action.amenity],
      };
    case "addImageUrl":
      return state.imageUrls.includes(action.url)
        ? state
        : {
            ...state,
            imageUrls: [...state.imageUrls, action.url],
            imagePreview: [...state.imagePreview, action.url],
          };
    case "removeImageUrl":
      return {
        ...state,
        imageUrls: state.imageUrls.filter((_, i) => i !== action.index),
        imagePreview: state.imagePreview.filter((_, i) => i !== action.index),
      };
    case "addImageFiles":
      return {
        ...state,
        imageFiles: [...state.imageFiles, ...action.files],
        imagePreview: [...state.imagePreview, ...action.previews],
      };
    case "removeImage": {
      const fileIndex = action.index - state.imageUrls.length;
      const objectUrls = state.imagePreview.filter((_, i) => i >= state.imageUrls.length);
      if (fileIndex >= 0 && objectUrls[fileIndex]) {
        URL.revokeObjectURL(objectUrls[fileIndex]);
      }
      return {
        ...state,
        imageFiles: fileIndex >= 0
          ? state.imageFiles.filter((_, i) => i !== fileIndex)
          : state.imageFiles,
        imagePreview: state.imagePreview.filter((_, i) => i !== action.index),
      };
    }
    default:
      return state;
  }
}

export default function EditPropertyForm({ propertyId }: { propertyId: string }) {
  const [propertyState, dispatch] = useReducer(propertyReducer, {
    selectedAmenities: [],
    imageUrls: [],
    imagePreview: [],
    imageFiles: [],
  });

  const { data: property, isLoading: propertyLoading, error: propertyError } = useProperty(propertyId);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { updateProperty, isSubmitting } = useUpdateProperty();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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
      imageUrls: "",
    },
  });

  const { selectedAmenities, imageUrls, imageFiles, imagePreview } = propertyState;

  useEffect(() => {
    if (!property) return;
    const savedAmenities = parseAmenitiesFromDescription(property.description || "");
    const imgUrls = property.images?.filter((img) => img && img.trim() !== "") || [];
    dispatch({ type: "init", amenities: savedAmenities, imageUrls: imgUrls });
  }, [property]);

  useEffect(() => {
    if (!property) return;
    const cleanDescription = stripAmenitiesFromDescription(property.description || "");
    const categoryId =
      typeof property.category === "object"
        ? property.category.id
        : property.category || "";
    const status: "AVAILABLE" | "RENTED" | "UNAVAILABLE" =
      property.available === false ? "RENTED" : "AVAILABLE";

    reset({
      title: property.title || "",
      description: cleanDescription,
      categoryId,
      location: property.location || "",
      price: property.price ? String(property.price) : "",
      bedrooms: property.bedrooms ? String(property.bedrooms) : "",
      bathrooms: property.bathrooms ? String(property.bathrooms) : "",
      size: property.area ? String(property.area) : "",
      status,
      imageUrls: "",
    });
  }, [property, reset]);

  const toggleAmenity = (amenity: string) => {
    dispatch({ type: "toggleAmenity", amenity });
  };

  const handleAddImageUrl = () => {
    const urlInput = document.getElementById("imageUrlInput") as HTMLInputElement;
    const url = urlInput?.value.trim();
    if (url) {
      dispatch({ type: "addImageUrl", url });
      if (urlInput) urlInput.value = "";
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    dispatch({ type: "removeImageUrl", index });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    dispatch({ type: "addImageFiles", files, previews });
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    dispatch({ type: "removeImage", index });
  };

  const onSubmit = async (data: FormData) => {
    const amenitiesText = selectedAmenities.length > 0
      ? `\n\nAmenities:\n${selectedAmenities.map((a) => `- ${a}`).join("\n")}`
      : "";

    const payload = {
      title: data.title,
      description: data.description + amenitiesText,
      location: data.location,
      price: parseFloat(data.price),
      bedrooms: parseInt(data.bedrooms),
      bathrooms: parseInt(data.bathrooms),
      size: data.size ? parseInt(data.size) : undefined,
      images: imageUrls,
      status: data.status,
      categoryId: data.categoryId,
    };

    const result = await updateProperty(
      propertyId,
      payload,
      propertyState.imageFiles.length > 0 ? propertyState.imageFiles : undefined
    );

    if (result) {
      toast.success("Property updated successfully!");
    }
  };

  if (propertyLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
          <Skeleton className="h-5 w-40 rounded" />
          <Skeleton className="h-8 w-64 rounded mt-2" />
          <Skeleton className="h-4 w-96 rounded mt-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/60">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-4 w-12 rounded mt-4" />
                <Skeleton className="h-24 w-full rounded" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
          <FileText className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
          Property not found
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {propertyError?.message || "The property you are trying to edit does not exist."}
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl">
          <Link href="/landlord-dashboard/my-properties">Back to My Properties</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Link
          href="/landlord-dashboard/my-properties"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Properties
        </Link>
        <div className="flex flex-col gap-2 mt-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Edit Property
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Update your property listing details, images, and availability.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Information */}
            <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
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
                    className={errors.title ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>
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
                    className={errors.description ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                            className={errors.categoryId ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
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
                      <p className="text-xs text-rose-500 font-medium">{errors.categoryId.message}</p>
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
                      className={errors.location ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                    />
                    {errors.location && (
                      <p className="text-xs text-rose-500 font-medium">{errors.location.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Details */}
            <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Pricing & Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      className={errors.price ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                    />
                    {errors.price && (
                      <p className="text-xs text-rose-500 font-medium">{errors.price.message}</p>
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
                      className={errors.bedrooms ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                    />
                    {errors.bedrooms && (
                      <p className="text-xs text-rose-500 font-medium">{errors.bedrooms.message}</p>
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
                      className={errors.bathrooms ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                    />
                    {errors.bathrooms && (
                      <p className="text-xs text-rose-500 font-medium">{errors.bathrooms.message}</p>
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
                      className={errors.size ? "border-rose-500 focus-visible:ring-rose-500/20" : ""}
                    />
                    {errors.size && (
                      <p className="text-xs text-rose-500 font-medium">{errors.size.message}</p>
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
                          <SelectItem value="AVAILABLE">🟢 Available</SelectItem>
                          <SelectItem value="RENTED">🔴 Rented</SelectItem>
                          <SelectItem value="UNAVAILABLE">⚪ Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-muted/40 text-foreground hover:bg-muted/80"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            isSelected
                              ? "bg-white border-white text-blue-600"
                              : "border-border/60"
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
            <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Property Images</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="imageUrlInput">Add Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrlInput"
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddImageUrl}
                      className="shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>
                </div>

                {imageUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-muted"
                      >
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/80?text=Error";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(index)}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="imageUpload">Upload New Images</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("imageUpload")?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Files
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {imageFiles.length} new file(s) selected
                    </span>
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {imagePreview.filter((_, i) => i >= imageUrls.length).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreview.map((preview, index) => {
                      if (index < imageUrls.length) return null;
                      return (
                        <div
                          key={index}
                          className="relative h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-muted"
                        >
                          <img
                            src={preview}
                            alt={`Upload ${index - imageUrls.length + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summary & Submit */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/60 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Property Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between py-3 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-auto border-0 bg-transparent p-0 h-auto">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AVAILABLE">🟢 Available</SelectItem>
                          <SelectItem value="RENTED">🔴 Rented</SelectItem>
                          <SelectItem value="UNAVAILABLE">⚪ Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Images</span>
                  <span className="text-sm font-medium text-foreground">
                    {imagePreview.length} image(s)
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/40">
                  <span className="text-sm text-muted-foreground">Amenities</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedAmenities.length} selected
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Updating Property...
                </div>
              ) : (
                "Update Property"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
