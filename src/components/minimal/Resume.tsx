/** Experience · Achievements · Education · Certification — the resume list sections. */

function Row({ title, meta, right }: { title: string; meta: string; right?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-[3px]">
        <span className="text-[13.5px] font-medium text-white">{title}</span>
        <span className="text-[12.5px] text-white/40">{meta}</span>
      </div>
      {right && <span className="whitespace-nowrap text-[12.5px] text-white/40">{right}</span>}
    </div>
  );
}

export function Experience() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Experience</h2>
      <div className="flex flex-col gap-[18px]">
        <Row title="FullStack Engineer · Depart" meta="Full-time | Jul 2026 – Present" right="Seoul, Onsite" />
        <Row
          title="Frontend Engineer · SSU IT Support Committee"
          meta="Sep 2024 – Aug 2026 | Frontend LEAD, Scholarship System TF"
          right="Soongsil Univ."
        />
      </div>
    </section>
  );
}

const awards = [
  {
    title: "Chairman's Award — K-PaaS Contest",
    desc: "For ssakssakfood, a location-based food-rescue platform. Planning and frontend.",
    org: "Korea Cloud Computing Research Association · NIA · MSIT · Dec 2025",
  },
  {
    title: "Excellence Award — Startup Hackathon",
    desc: "Auto-sorting recycling bin with linked value-added services.",
    org: "Soongsil University Startup Support Foundation · Nov 2020",
  },
];

export function Achievements() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Achievements</h2>
      <div className="flex flex-col gap-[18px]">
        {awards.map((a) => (
          <div key={a.title} className="flex flex-col gap-[3px]">
            <span className="text-[13.5px] font-medium text-white">{a.title}</span>
            <span className="text-[13px] text-white/45">{a.desc}</span>
            <span className="text-[12px] text-white/35">{a.org}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Education</h2>
      <div className="flex flex-col gap-[18px]">
        <Row
          title="Soongsil University"
          meta="Business Administration, double major in Computer Science · Mar 2020 – Aug 2026 · GPA 3.68 / 4.5"
          right="Seoul"
        />
        <Row
          title="SAP Co-op ABAP Track"
          meta="Completed, 240h+ · Dec 2025 – Feb 2026"
          right="SAP"
        />
      </div>
    </section>
  );
}

export function Certification() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Certification</h2>
      <Row title="Back-End Developer — ABAP Cloud" meta="Issued Feb 2026" right="SAP" />
    </section>
  );
}
