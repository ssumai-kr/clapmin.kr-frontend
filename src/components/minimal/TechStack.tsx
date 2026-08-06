const groups: { label: string; items: string[] }[] = [
  { label: "Frontend", items: ["TypeScript", "React", "Vite", "Tailwind CSS", "React Router", "GSAP", "OGL"] },
  { label: "Backend & ERP", items: ["SAP ERP", "Node.js", "REST API"] },
  { label: "Tools", items: ["Git", "GitHub", "pnpm", "Vercel", "ESLint", "Prettier", "Figma"] },
];

export default function TechStack() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Tech Stack</h2>
      <div className="flex flex-col gap-4">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-[9px] text-[12px] text-white/35">{g.label}</p>
            <div className="flex flex-wrap gap-[7px]">
              {g.items.map((i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/[0.06] bg-[#2B2B2B] px-[11px] py-[5px] font-mono text-[11.5px] text-white/70"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
