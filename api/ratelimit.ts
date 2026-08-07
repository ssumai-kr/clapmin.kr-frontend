import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-IP rate limiting for the public /api/chat endpoint.
 *
 * Two tiers: a short window that stops bursts, and a daily cap that stops a
 * slow drip from running up a bill overnight.
 *
 * Backed by Upstash Redis when UPSTASH_REDIS_REST_URL / _TOKEN are set.
 * Without them it falls back to an in-memory counter — that only protects a
 * single warm instance (serverless spins up many), so configure Upstash before
 * relying on this in production.
 */

const BURST_LIMIT = 10; // requests per minute
const DAILY_LIMIT = 100; // requests per day

export interface RateLimitResult {
  success: boolean;
  scope: "burst" | "daily" | null;
  retryAfter: number; // seconds
}

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redisLimiters = hasUpstash
  ? (() => {
      const redis = Redis.fromEnv();
      return {
        burst: new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(BURST_LIMIT, "1 m"),
          prefix: "clapmin:chat:burst",
          analytics: false,
        }),
        daily: new Ratelimit({
          redis,
          limiter: Ratelimit.fixedWindow(DAILY_LIMIT, "1 d"),
          prefix: "clapmin:chat:daily",
          analytics: false,
        }),
      };
    })()
  : null;

// ---- in-memory fallback (single instance only) ----
interface Bucket {
  count: number;
  resetAt: number;
}
const memory = new Map<string, Bucket>();

function memoryHit(key: string, limit: number, windowMs: number): RateLimitResult["success"] {
  const now = Date.now();
  const bucket = memory.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

function sweepMemory() {
  if (memory.size < 5000) return;
  const now = Date.now();
  for (const [k, v] of memory) if (now >= v.resetAt) memory.delete(k);
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  if (redisLimiters) {
    try {
      const burst = await redisLimiters.burst.limit(ip);
      if (!burst.success) {
        return {
          success: false,
          scope: "burst",
          retryAfter: Math.max(1, Math.ceil((burst.reset - Date.now()) / 1000)),
        };
      }
      const daily = await redisLimiters.daily.limit(ip);
      if (!daily.success) {
        return {
          success: false,
          scope: "daily",
          retryAfter: Math.max(1, Math.ceil((daily.reset - Date.now()) / 1000)),
        };
      }
      return { success: true, scope: null, retryAfter: 0 };
    } catch {
      // Redis unreachable (outage, bad credentials). Don't take the chatbot
      // down with it — fall through to the in-memory limiter so requests still
      // get *some* protection instead of none.
    }
  }

  sweepMemory();
  if (!memoryHit(`b:${ip}`, BURST_LIMIT, 60_000)) {
    return { success: false, scope: "burst", retryAfter: 60 };
  }
  if (!memoryHit(`d:${ip}`, DAILY_LIMIT, 86_400_000)) {
    return { success: false, scope: "daily", retryAfter: 3600 };
  }
  return { success: true, scope: null, retryAfter: 0 };
}

/** Client IP as seen through Vercel's proxy. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
