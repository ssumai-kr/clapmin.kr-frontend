import { useEffect, useRef, useState } from "react";

interface Message { who: "you" | "ai"; text: string }

const SUGGESTIONS = ["What does he build?", "Tech stack", "Projects", "Contact"];

/** Apple-style "liquid glass": translucent tint + heavy blur + specular edge. */
const glass: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  boxShadow:
    "inset 0 1px 0 0 rgba(255,255,255,0.35), inset 0 0 0 1px rgba(255,255,255,0.04), 0 12px 40px -8px rgba(0,0,0,0.55)",
};

/** Soft moving highlight along the top edge, like light catching glass. */
function Sheen({ rounded }: { rounded: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.14] to-transparent ${rounded}`}
    />
  );
}

/** Placeholder answers — swap answer() for your LLM endpoint. */
function answer(q: string): string {
  const t = q.toLowerCase();
  if (/stack|tech|기술|언어/.test(t))
    return "Mostly TypeScript + React with Vite and Tailwind on the front, Node and REST services behind it, and SAP ERP work at Depart.";
  if (/project|프로젝트/.test(t))
    return "Three shipped: SSUPORT (scholarship platform), the Soongsil Student Council site, and grabPT, a PT matching platform.";
  if (/experience|경력|work|회사/.test(t)) return "FullStack Engineer at Depart since July 2026, in Seoul, onsite.";
  if (/award|수상|achievement/.test(t))
    return "Excellence Award at the Soongsil Startup Hackathon, and a Chairman's Award at the K-PaaS Application Contest (NIA · CCCR).";
  if (/contact|email|메일|연락/.test(t)) return "fhsjdvs@gmail.com — or github.com/ssumai-kr.";
  if (/education|학력|대학/.test(t))
    return "Soongsil University — Business Administration and Computer Science and Engineering.";
  return "That one's not wired up yet. Try asking about his stack, projects, experience, or how to get in touch.";
}

export default function AskDock() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { who: "ai", text: "Hi — I'm Sumin's assistant. Ask me about his work, stack, or projects." },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function send(q: string) {
    const text = q.trim();
    if (!text || busy) return;
    setOpen(true);
    setDraft("");
    setBusy(true);
    setMessages((m) => [...m, { who: "you", text }]);
    setTimeout(() => {
      setBusy(false);
      setMessages((m) => [...m, { who: "ai", text: answer(text) }]);
    }, 420);
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center px-4 pb-[22px]">
      <div className="pointer-events-auto flex w-full max-w-[560px] flex-col gap-2.5">
        {open && (
          <div
            className="relative flex max-h-[46vh] flex-col gap-3.5 overflow-y-auto rounded-2xl border border-white/15 p-3.5"
            style={glass}
          >
            <Sheen rounded="rounded-t-2xl" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9.5px] tracking-[0.14em] text-white/40">ASK ABOUT ME</span>
              <button onClick={() => setOpen(false)} className="text-[11.5px] text-white/40 hover:text-white">
                esc
              </button>
            </div>
            {messages.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="min-w-[26px] pt-[3px] font-mono text-[10.5px] text-white/30">{m.who}</span>
                <p className={`text-[13px] leading-[1.7] [text-wrap:pretty] ${m.who === "you" ? "text-white" : "text-white/60"}`}>
                  {m.text}
                </p>
              </div>
            ))}
            {busy && <span className="pl-9 text-[13px] text-white/35">…</span>}
            {messages.length < 2 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-white/[0.08] bg-white/5 px-[11px] py-[5px] text-[11.5px] text-white/60 hover:bg-white/10 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="relative flex items-center gap-2.5 overflow-hidden rounded-full border border-white/20 py-[9px] pl-4 pr-2.5"
          style={glass}
        >
          <Sheen rounded="rounded-t-full" />
          <span className="h-[11px] w-[11px] flex-shrink-0 rounded-full border-[1.5px] border-white/50" />
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Ask me anything"
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-white outline-none placeholder:text-white/40"
          />
          <span className="flex-shrink-0 rounded-md border border-white/25 px-1.5 py-0.5 font-mono text-[10.5px] text-white/50">
            ⌘K
          </span>
          <button
            type="submit"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[13px] text-[#171717] hover:bg-white/80"
          >
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
