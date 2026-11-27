"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

interface LinkPreviewCardProps {
  open: boolean;
  url: string;
  src: string;
  width: number;
  height: number;
  /** Cursor offset from the trigger's center (px); the card follows it. */
  offsetX: number;
}

/**
 * The animated preview popup. Lives in its own module so `motion` is only
 * downloaded the first time someone hovers a link preview.
 */
export default function LinkPreviewCard({
  open,
  url,
  src,
  width,
  height,
  offsetX,
}: LinkPreviewCardProps) {
  const x = useMotionValue(offsetX);
  const translateX = useSpring(x, { stiffness: 100, damping: 15 });

  useEffect(() => {
    x.set(offsetX);
  }, [offsetX, x]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 260, damping: 20 },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
          className="rounded-xl shadow-xl"
          style={{ x: translateX }}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border-2 border-transparent bg-card p-1 shadow hover:border-border"
            style={{ fontSize: 0 }}
          >
            {/* External screenshot service: next/image optimization adds nothing here */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              width={width}
              height={height}
              className="rounded-lg"
              alt="Preview of the linked page"
            />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
