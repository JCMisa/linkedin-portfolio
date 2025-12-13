"use server";

import { v2 as cloudinary } from "cloudinary";
import { withErrorHandling } from "./utils";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an image file to Cloudinary
 * @param file - The file to upload (as base64 string or file buffer)
 * @param folder - Optional folder name in Cloudinary
 * @returns The uploaded image URL
 */
export const uploadImageToCloudinary = withErrorHandling(
  async (file: File, folder: string = "jcm") => {
    // Validate environment variables
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary configuration is missing");
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });

    if (!result.secure_url) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    return result.secure_url;
  }
);

/**
 * Extracts the public_id from a Cloudinary URL
 * @param url - The Cloudinary image URL
 * @returns The public_id (folder/filename without extension) or null if invalid
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URLs typically look like:
    // https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{filename}.{ext}
    // https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{filename}.{ext}

    // Match everything after /image/upload/
    const match = url.match(/\/image\/upload\/(.+)$/);

    if (!match || !match[1]) {
      return null;
    }

    let path = match[1];

    // Remove version number if present (v1234567890/)
    path = path.replace(/^v\d+\//, "");

    // Split by "/" and find the part that contains a dot (the filename)
    const parts = path.split("/");
    const filenameIndex = parts.findIndex((part) => part.includes("."));

    if (filenameIndex === -1) {
      // No dot found, might be transformations only
      return null;
    }

    // Reconstruct the public_id from folder path and filename (without extension)
    const publicIdParts = parts.slice(0, filenameIndex + 1);
    let publicId = publicIdParts.join("/");

    // Remove file extension
    publicId = publicId.replace(/\.[^.]+$/, "");

    return publicId || null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
}

/**
 * Deletes an image from Cloudinary
 * @param imageUrl - The Cloudinary image URL to delete
 * @returns Success status
 */
export const deleteImageFromCloudinary = withErrorHandling(
  async (imageUrl: string | null | undefined) => {
    // Validate environment variables
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary configuration is missing");
    }

    // If no image URL or not a Cloudinary URL, skip deletion
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
      return { success: true, message: "No Cloudinary image to delete" };
    }

    // Extract public_id from URL
    const publicId = extractPublicIdFromUrl(imageUrl);

    if (!publicId) {
      console.warn("Could not extract public_id from URL:", imageUrl);
      return { success: false, message: "Invalid Cloudinary URL" };
    }

    try {
      // Delete from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });

      if (result.result === "ok" || result.result === "not found") {
        // "not found" is also considered success (image already deleted)
        return { success: true, message: "Image deleted successfully" };
      } else {
        throw new Error(`Failed to delete image: ${result.result}`);
      }
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw error;
    }
  }
);
