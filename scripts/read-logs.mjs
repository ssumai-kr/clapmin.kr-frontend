#!/usr/bin/env node
/**
 * Print recent AI assistant conversations stored by api/chatlog.ts.
 *
 *   pnpm logs          # newest 20
 *   pnpm logs 50       # newest 50
 *
 * Reads UPSTASH_REDIS_REST_URL / _TOKEN from .env (via --env-file in the
 * package.json script). Read-only — it never modifies the log.
 */

const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "clapmin:chat:log";
const limit = Number(process.argv[2] ?? 20);

if (!URL_ || !TOKEN) {
  console.error(
    "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN 이 없습니다. .env를 확인하세요.",
  );
  process.exit(1);
}

const call = async (path) => {
  const res = await fetch(`${URL_}/${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
};

const [total, rows] = await Promise.all([
  call(`llen/${KEY}`),
  call(`lrange/${KEY}/0/${limit - 1}`),
]);

if (!rows?.length) {
  console.log("저장된 대화가 없습니다.");
  process.exit(0);
}

console.log(`총 ${total}건 중 최근 ${rows.length}건 (최신순)\n`);

let inTok = 0;
let outTok = 0;

for (const raw of rows) {
  let d;
  try {
    d = JSON.parse(raw);
  } catch {
    continue;
  }
  inTok += d.tokens?.in ?? 0;
  outTok += d.tokens?.out ?? 0;

  const when = new Date(d.ts).toLocaleString("ko-KR");
  console.log("─".repeat(72));
  console.log(`${when}   sid=${d.sid}   tokens ${d.tokens?.in ?? "?"}/${d.tokens?.out ?? "?"}`);
  console.log(`  Q  ${d.q}`);
  console.log(
    `  A  ${String(d.a).split("\n").join("\n     ")}`,
  );
}

// Haiku 4.5: $1 per 1M input, $5 per 1M output.
const cost = (inTok / 1e6) * 1 + (outTok / 1e6) * 5;
console.log("─".repeat(72));
console.log(
  `표시된 ${rows.length}건 합계 — 입력 ${inTok.toLocaleString()} / 출력 ${outTok.toLocaleString()} 토큰, 약 $${cost.toFixed(4)}`,
);
