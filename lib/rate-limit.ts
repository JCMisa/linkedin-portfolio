import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

/**
 * Per-user rate limits shared by every serverless instance (Upstash Redis,
 * same region as the functions and Neon: ap-southeast-1).
 *
 * Instances live at module scope so each one keeps an in-memory "ephemeral
 * cache" of users who are already blocked, which skips the Redis round trip
 * for repeat attempts until their window resets.
 */
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// If Redis doesn't answer within this time, the request is allowed (logged).
const REDIS_TIMEOUT_MS = 1000;

const limiters = {
  /** AI chatbot: 5 questions per sliding 5 minutes. */
  chat: new Ratelimit({
    redis,
    prefix: "rl:chat",
    limiter: Ratelimit.slidingWindow(5, "5 m"),
    timeout: REDIS_TIMEOUT_MS,
  }),
  /**
   * Voice inquiry processing: credits cap the total, this caps bursts
   * (parallel requests would otherwise each call Gemini before a credit is
   * spent).
   */
  inquiry: new Ratelimit({
    redis,
    prefix: "rl:inquiry",
    limiter: Ratelimit.slidingWindow(3, "10 m"),
    timeout: REDIS_TIMEOUT_MS,
  }),
};

export type RateLimitName = keyof typeof limiters;

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the next request is allowed (0 when allowed). */
  retryAfterSec: number;
}

/**
 * Counts one request for `identifier` (use the user id) against `name`.
 * Fails open: if Redis is unreachable the request is allowed and the error is
 * logged, so a store outage never takes the feature down.
 */
export async function checkLimit(
  name: RateLimitName,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const { success, reset, reason } = await limiters[name].limit(identifier);
    if (reason === "timeout") {
      console.warn(`[rate-limit:${name}] Redis timed out; request allowed`);
    }
    return {
      allowed: success,
      retryAfterSec: success
        ? 0
        : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error(`[rate-limit:${name}] check failed; request allowed`, error);
    return { allowed: true, retryAfterSec: 0 };
  }
}

/** Standard 429 headers so clients and proxies know when to retry. */
export function rateLimitHeaders(result: RateLimitResult) {
  return { "Retry-After": String(result.retryAfterSec) };
}
