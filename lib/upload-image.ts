export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_AVATAR_BYTES = MAX_IMAGE_BYTES;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

/** The `accept` attribute for a file input, kept in step with the check below. */
export const IMAGE_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

const formatMegabytes = (bytes: number) =>
  `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;

/**
 * Client-side gate before submitting a file. Returns user-facing copy when
 * the file is unusable, or `null` when it is valid.
 */
export const validateImageFile = (
  file: File,
  maxBytes: number = MAX_IMAGE_BYTES,
): string | null => {
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Please choose a JPEG, PNG, WebP, or AVIF image.";
  }

  if (file.size === 0) {
    return "That file looks empty. Please choose another image.";
  }

  if (file.size > maxBytes) {
    return `That image is ${formatMegabytes(file.size)}. Please choose one under ${formatMegabytes(maxBytes)}.`;
  }

  return null;
};
