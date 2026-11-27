/** Cloudinary folders the app may upload into (validated server-side). */
export const UPLOAD_FOLDERS = [
  "jcm",
  "projects",
  "jcm/experiences",
  "jcm/testimonials",
  "jcm/profile",
  "jcm/cover",
] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];
