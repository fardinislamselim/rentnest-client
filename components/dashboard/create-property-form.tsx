"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Upload, Check } from "lucide-react";
import { useCreateProperty } from "@/hooks/use-create-property";
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
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function CreatePropertyForm() {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const { createProperty, isSubmitting } = useCreateProperty();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

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

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAddImageUrl = () => {
    const urlInput = document.getElementById("imageUrlInput") as HTMLInputElement;
    const url = urlInput?.value.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls((prev) => [...prev, url]);
      setImagePreview((prev) => [...prev, url]);
      if (urlInput) urlInput.value = "";
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    const amenitiesText = selectedAmenities.length > 0
      ? `\n\nAmenities:\n${selectedAmenities.map((a) => `- ${a}`).join("\n")}`
      : "";

    const payload: Parameters<typeof createProperty>[0] = {
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

    const result = await createProperty(payload, imageFiles.length > 0 ? imageFiles : undefined);
    if (result) {
      reset();
      setSelectedAmenities([]);
      setImageUrls([]);
      setImageFiles([]);
      setImagePreview([]);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-border/40 pb-6">
        <Link
          href="/landlord-dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col gap-2 mt-2">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Create New Property
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Fill in the details below to list your property for rent.
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
                  <Label htmlFor="imageUrlInput">Image URLs</Label>
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
                  <Label htmlFor="imageUpload">Upload Images</Label>
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
                      {imageFiles.length} file(s) selected
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

                {imagePreview.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imagePreview.map((preview, index) => (
                      <div
                        key={index}
                        className="relative h-20 w-20 overflow-hidden rounded-xl border border-border/60 bg-muted"
                      >
                        <img
                          src={preview}
                          alt={`Upload ${index + 1}`}
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
                    ))}
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
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Property...
                </div>
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
