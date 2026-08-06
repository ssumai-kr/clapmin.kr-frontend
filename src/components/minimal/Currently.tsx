import { useState } from "react";
import { Copy, Check } from "lucide-react";

const EMAIL = "fhsjdvs@gmail.com";

export default function Currently() {
  const [copied, setCopied] = useState(false);
  return (
    <section>
      <h2 className="mb-3 text-[13.5px] font-medium text-white">Currently</h2>
      <p className="mb-4 text-[13.5px] leading-[1.75] text-white/55 [text-wrap:pretty]">
        Building web software and SAP ERP systems at Depart. I care about the seam between the
        interface and the system behind it — how it looks, how it holds up, and how it feels to use.
      </p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(EMAIL);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        }}
        className="flex items-center gap-2 text-[13px] text-white/55 transition-colors hover:text-white"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "copied" : EMAIL}
      </button>
    </section>
  );
}
