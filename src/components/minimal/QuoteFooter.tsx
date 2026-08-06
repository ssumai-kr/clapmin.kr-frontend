const links = [
  { label: "GitHub", href: "https://github.com/ssumai-kr" },
  { label: "Gmail", href: "mailto:fhsjdvs@gmail.com" },
  { label: "clapmin.kr", href: "https://clapmin.kr" },
];

export default function QuoteFooter() {
  return (
    <section className="flex flex-col items-center gap-7 border-t border-white/[0.07] pt-6">
      <p className="text-center font-mono text-[12.5px] leading-[1.8] text-white/45">
        "Simple is not the starting point. It is what's left."
      </p>
      <div className="flex gap-[22px] text-[12.5px]">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="border-b border-white/15 text-white/55 hover:text-white">
            {l.label}
          </a>
        ))}
      </div>
    </section>
  );
}
