/** Experience · Achievements · Education — the three list sections. */

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
      <Row title="FullStack Engineer · Depart" meta="Full-time | Jul 2026 – Present" right="Seoul, Onsite" />
    </section>
  );
}

const awards = [
  {
    title: "Excellence Award",
    desc: "Startup Hackathon, awarded for the team's product execution.",
    org: "Soongsil University",
  },
  {
    title: "Chairman's Award",
    desc: "K-PaaS Application Contest, cloud-native service track.",
    org: "NIA · CCCR",
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
      <Row
        title="Soongsil University"
        meta="Business Administration · Computer Science and Engineering"
        right="Seoul"
      />
    </section>
  );
}
