import { toast } from "sonner";

/** Opens the native share sheet, or copies the project link as a fallback. */
export async function shareProject(project: { id: string; title: string }) {
  const url = `${window.location.origin}/projects/${project.id}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: project.title,
        text: `Check out this project: ${project.title}`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  } catch (error) {
    // AbortError = the user closed the share sheet; not a real failure
    if (error instanceof DOMException && error.name === "AbortError") return;
    toast.error("Couldn't share this project.");
  }
}
