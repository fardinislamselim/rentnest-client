import type { PropertyStatus } from "@/types/property";

export interface PropertyMutationInput {
  title?: string;
  description?: string;
  location?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  status?: PropertyStatus;
  categoryId?: string;
  /** Existing gallery URLs to preserve on update. */
  images?: string[];
  /** New cover image file (`primaryImage` field). */
  primaryImageFile?: File | null;
  /** New gallery image files (`images` field). */
  imageFiles?: File[];
}

/**
 * Serializes property fields and media files into `FormData` matching the
 * backend `uploadPropertyMedia` + Zod `.strict()` schema.
 */
export const buildPropertyFormData = (input: PropertyMutationInput): FormData => {
  const formData = new FormData();

  if (input.title !== undefined) formData.append("title", input.title);
  if (input.description !== undefined) {
    formData.append("description", input.description);
  }
  if (input.location !== undefined) formData.append("location", input.location);
  if (input.price !== undefined) formData.append("price", String(input.price));
  if (input.bedrooms !== undefined) {
    formData.append("bedrooms", String(input.bedrooms));
  }
  if (input.bathrooms !== undefined) {
    formData.append("bathrooms", String(input.bathrooms));
  }
  if (input.size !== undefined && !Number.isNaN(input.size)) {
    formData.append("size", String(input.size));
  }
  if (input.status !== undefined) formData.append("status", input.status);
  if (input.categoryId !== undefined) {
    formData.append("categoryId", input.categoryId);
  }

  if (input.images !== undefined) {
    formData.append("images", JSON.stringify(input.images));
  }

  if (input.primaryImageFile) {
    formData.append("primaryImage", input.primaryImageFile);
  }

  if (input.imageFiles && input.imageFiles.length > 0) {
    input.imageFiles.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};
