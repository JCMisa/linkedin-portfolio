// lib/rate-limit.ts
type Entry = { count: number; firstTs: number };

const WINDOW_MS = 5 * 60 * 1000; // 5 min
const MAX = 5;

const store = new Map<string, Entry>();

export function checkLimit(userId: string): {
  allowed: boolean;
  waitSec: number;
} {
  const now = Date.now();
  const prev = store.get(userId);

  if (!prev || now - prev.firstTs > WINDOW_MS) {
    // new window
    store.set(userId, { count: 1, firstTs: now });
    return { allowed: true, waitSec: 0 };
  }

  if (prev.count < MAX) {
    prev.count++;
    return { allowed: true, waitSec: 0 };
  }

  // limit exceeded
  const waitMs = WINDOW_MS - (now - prev.firstTs);
  return { allowed: false, waitSec: Math.ceil(waitMs / 1000) };
}
