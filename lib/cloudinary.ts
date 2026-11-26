import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/** Uploads an image and returns its HTTPS URL. Throws on failure. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  if (!result.secure_url) throw new Error("Cloudinary returned no URL");
  return result.secure_url;
}

/**
 * Extracts the public_id from a Cloudinary delivery URL, e.g.
 * https://res.cloudinary.com/<cloud>/image/upload/v123/<folder>/<name>.<ext>
 */
function extractPublicId(url: string): string | null {
  const match = url.match(/\/image\/upload\/(.+)$/);
  if (!match) return null;

  const parts = match[1].replace(/^v\d+\//, "").split("/");
  const fileIndex = parts.findIndex((part) => part.includes("."));
  if (fileIndex === -1) return null;

  return (
    parts
      .slice(0, fileIndex + 1)
      .join("/")
      .replace(/\.[^.]+$/, "") || null
  );
}

/**
 * Best-effort delete of a Cloudinary image. Never throws: a failed cleanup
 * must not block the DB operation that triggered it. Non-Cloudinary URLs
 * are ignored.
 */
export async function deleteImage(url: string | null | undefined) {
  if (!url || !url.includes("res.cloudinary.com")) return;

  const publicId = extractPublicId(url);
  if (!publicId) {
    console.warn("[cloudinary] could not parse public_id from", url);
    return;
  }

  try {
    const { result } = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    if (result !== "ok" && result !== "not found") {
      console.warn("[cloudinary] destroy returned", result, "for", publicId);
    }
  } catch (error) {
    console.error("[cloudinary] failed to delete", publicId, error);
  }
}

/** Deletes `previous` only when it was replaced by a different image. */
export async function deleteReplacedImage(
  previous: string | null | undefined,
  next: string | null | undefined,
) {
  if (previous && next && previous !== next) await deleteImage(previous);
}
