/**
 * Image upload to imgbb, which is what the rest of the app already uses to turn
 * a picked file into a hosted URL.
 *
 * The backend never receives a file: `PATCH /user/profile/picture` validates
 * `avatar` with `z.string().url()`, so a URL is the only thing it accepts. This
 * helper produces that URL.
 *
 * Every error thrown here is an `ImageUploadError` whose message was written
 * locally — imgbb's own `error.message` is never surfaced, since it is a
 * third-party internal string.
 */

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";

const IMGBB_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY || "7e7269e8b8a3e722e21a7b9b5781490a";

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/** The `accept` attribute for a file input, kept in step with the check below. */
export const IMAGE_ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(",");

/** Message authored here, so it is always safe to show. */
export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageUploadError";
  }
}

const formatMegabytes = (bytes: number) =>
  `${(bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 1)} MB`;

/**
 * Client-side gate before we spend a round trip. Returns user-facing copy when
 * the file is unusable, or `null` when it is fine.
 */
export const validateImageFile = (
  file: File,
  maxBytes: number = MAX_AVATAR_BYTES,
): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a JPG, PNG, WebP or GIF image.";
  }

  if (file.size > maxBytes) {
    return `That image is ${formatMegabytes(file.size)}. Please choose one under ${formatMegabytes(maxBytes)}.`;
  }

  if (file.size === 0) {
    return "That file looks empty. Please choose another image.";
  }

  return null;
};

/** Uploads the file and resolves with its hosted URL. */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("key", IMGBB_KEY);
  formData.append("image", file);

  let response: Response;

  try {
    response = await fetch(IMGBB_ENDPOINT, { method: "POST", body: formData });
  } catch {
    throw new ImageUploadError(
      "We couldn't reach the image service. Check your connection and try again.",
    );
  }

  let payload: { success?: boolean; data?: { url?: string } } | null = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success || !payload.data?.url) {
    throw new ImageUploadError(
      "We couldn't upload that image. Please try again, or paste an image link instead.",
    );
  }

  return payload.data.url;
};

/** Narrows to copy we authored; anything else gets generic wording. */
export const imageUploadMessage = (error: unknown): string =>
  error instanceof ImageUploadError
    ? error.message
    : "We couldn't upload that image. Please try again.";
