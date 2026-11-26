import { getActionError } from "@/lib/action-result";
import { getUploadSignature } from "@/lib/upload-actions";
import type { UploadFolder } from "@/lib/upload-folders";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

/**
 * Uploads an image straight from the browser to Cloudinary using a
 * server-issued signature, and returns its HTTPS URL. Throws a readable error.
 */
export async function uploadImageFile(
  file: File,
  folder: UploadFolder = "jcm",
): Promise<string> {
  // Fast client-side checks (Cloudinary also enforces formats via the signature)
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use a JPG, PNG, WebP or SVG image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 10 MB or smaller.");
  }

  const signed = await getUploadSignature({ folder });
  const error = getActionError(signed, "Couldn't start the upload.");
  if (error || !signed?.data) throw new Error(error ?? "Upload failed.");

  const { apiKey, cloudName, signature, timestamp, allowed_formats } =
    signed.data;
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);
  body.append("allowed_formats", allowed_formats);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body },
  );
  const json = (await res.json().catch(() => null)) as {
    secure_url?: string;
    error?: { message?: string };
  } | null;

  if (!res.ok || !json?.secure_url) {
    throw new Error(json?.error?.message ?? "Image upload failed.");
  }
  return json.secure_url;
}
