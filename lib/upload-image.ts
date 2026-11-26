import { getActionError } from "@/lib/action-result";
import { uploadImageAction } from "@/lib/upload-actions";
import type { UploadFolder } from "@/lib/upload-folders";

/** Client helper: uploads an image and returns its URL, or throws a readable error. */
export async function uploadImageFile(
  file: File,
  folder: UploadFolder = "jcm",
): Promise<string> {
  const result = await uploadImageAction({ file, folder });
  const error = getActionError(
    result,
    "Image upload failed. Please try again.",
  );
  if (error || !result?.data) throw new Error(error ?? "Image upload failed.");
  return result.data.url;
}
