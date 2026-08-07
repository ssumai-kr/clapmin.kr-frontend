import { Redis } from "@upstash/redis";

/**
 * Conversation logging for /api/chat.
 *
 * Privacy notes — deliberate choices, don't "improve" these without thinking:
 *  - The visitor's IP is NEVER stored here. Rate limiting uses the IP; logs use
 *    a random client-generated session id instead, so a stored conversation
 *    cannot be tied back to a person.
 *  - Entries expire automatically (TTL) and the list is capped, so nothing is
 *    kept longer or larger than needed.
 *
 * Read them in the Upstash console (Data Browser → key `clapmin:chat:log`).
 * No-ops when Upstash isn't configured.
 */

const LOG_KEY = "clapmin:chat:log";
const KEEP_ENTRIES = 1000; // most recent N conversations
const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
const MAX_FIELD_CHARS = 2000;

export interface ChatLogEntry {
  ts: string;
  sid: string;
  q: string;
  a: string;
  tokens?: { in?: number; out?: number };
}

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

/** Best-effort: logging must never break or slow down a reply. */
export async function logChat(entry: ChatLogEntry): Promise<void> {
  if (!redis) return;
  try {
    const row: ChatLogEntry = {
      ts: entry.ts,
      sid: entry.sid.slice(0, 64),
      q: entry.q.slice(0, MAX_FIELD_CHARS),
      a: entry.a.slice(0, MAX_FIELD_CHARS),
      tokens: entry.tokens,
    };
    await redis.lpush(LOG_KEY, JSON.stringify(row));
    await redis.ltrim(LOG_KEY, 0, KEEP_ENTRIES - 1);
    await redis.expire(LOG_KEY, TTL_SECONDS);
  } catch {
    // swallow — a logging failure is not worth failing the request over
  }
}
