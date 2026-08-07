import { SYSTEM_PROMPT } from "./persona";
import { checkRateLimit, clientIp } from "./ratelimit";
import { logChat } from "./chatlog";

// Runs as a Vercel Edge Function (Web Streams — clean streaming).
//
// The Anthropic API is called over plain fetch rather than @anthropic-ai/sdk:
// the SDK reaches for node:fs / node:path (to read `ant auth login` profiles),
// which the Edge runtime doesn't provide, and it ships no edge-specific entry
// point. Talking to /v1/messages directly keeps this function edge-compatible.
export const config = { runtime: "edge" };

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 800;
const MAX_HISTORY = 12; // last N turns kept
const MAX_CHARS = 2000; // per-message cap

type Role = "user" | "assistant";
interface ChatMessage {
  role: Role;
  content: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const cleaned: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) cleaned.push({ role, content: text });
  }
  // Keep the most recent turns, and ensure it starts with a user message.
  const trimmed = cleaned.slice(-MAX_HISTORY);
  while (trimmed.length && trimmed[0].role === "assistant") trimmed.shift();
  return trimmed;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "Server not configured" }, 500);
  }

  // Rate limit before doing any billable work.
  const limit = await checkRateLimit(clientIp(request));
  if (!limit.success) {
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        scope: limit.scope,
        retryAfter: limit.retryAfter,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(limit.retryAfter),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const messages = sanitize((payload as { messages?: unknown })?.messages);
  if (!messages || messages.length === 0) {
    return json({ error: "No valid messages" }, 400);
  }

  // Random, client-generated conversation id. Used only to group log entries —
  // it is not tied to the visitor's IP or identity.
  const rawSid = (payload as { sid?: unknown })?.sid;
  const sid = typeof rawSid === "string" ? rawSid.slice(0, 64) : "unknown";
  const question = messages[messages.length - 1]?.content ?? "";

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = "";
      let usage: { in?: number; out?: number } | undefined;
      try {
        const upstream = await fetch(ANTHROPIC_URL, {
          method: "POST",
          headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": ANTHROPIC_VERSION,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            messages,
            stream: true,
          }),
        });
        if (!upstream.ok || !upstream.body) {
          throw new Error(`anthropic ${upstream.status}`);
        }

        // Parse the SSE stream, forwarding only the text deltas.
        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Keep the trailing partial line for the next chunk.
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;

            let evt: any;
            try {
              evt = JSON.parse(payload);
            } catch {
              continue;
            }

            if (
              evt.type === "content_block_delta" &&
              evt.delta?.type === "text_delta" &&
              typeof evt.delta.text === "string"
            ) {
              answer += evt.delta.text;
              controller.enqueue(encoder.encode(evt.delta.text));
            } else if (evt.type === "message_start") {
              usage = { ...usage, in: evt.message?.usage?.input_tokens };
            } else if (evt.type === "message_delta") {
              usage = { ...usage, out: evt.usage?.output_tokens };
            } else if (evt.type === "error") {
              throw new Error(evt.error?.type ?? "anthropic stream error");
            }
          }
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            "지금 답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
          ),
        );
      } finally {
        // Logged after the text has already been streamed, so it costs the
        // visitor no waiting. Never throws (logChat swallows its own errors).
        if (answer) {
          await logChat({
            ts: new Date().toISOString(),
            sid,
            q: question,
            a: answer,
            tokens: usage,
          });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
