import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { OptimizedProject } from "@/types/index.e";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>,
) => {
  return async (...args: A): Promise<T> => {
    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return errorMessage as unknown as T;
    }
  };
};

export const showConfetti = () => {
  const end = Date.now() + 3 * 1000; // 3 seconds
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

  const frame = () => {
    if (Date.now() > end) return;

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors: colors,
    });

    requestAnimationFrame(frame);
  };

  frame();
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const handleShare = async (project: OptimizedProject) => {
  const shareData = {
    title: project.title,
    text: `Check out this project: ${project.title}`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}projects/${project.id}`,
  };

  try {
    // Check if the browser supports the Share API
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback: Copy to clipboard if Share API is unavailable (e.g., older desktop browsers)
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
      // Pro-tip: Use a toast.success() here instead of alert!
    }
  } catch (err) {
    console.error("Error sharing:", err);
  }
};
