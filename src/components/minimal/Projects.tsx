import { projects } from "../../data/projects";

export default function Projects() {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Projects</h2>
      <div className="flex flex-col gap-[18px]">
        {projects.map((p) => {
          const body = (
            <>
              <img
                src={p.imageUrl}
                alt={p.title}
                className={`h-[34px] w-[34px] rounded-lg border border-white/[0.06] bg-[#2B2B2B] ${
                  p.imageContain ? "object-contain p-[5px]" : "object-cover"
                }`}
              />
              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-medium text-white">{p.title}</span>
                  {p.liveUrl && (
                    <span className="rounded-full bg-[#2B2B2B] px-[7px] py-0.5 text-[10.5px] text-white/50">
                      Live
                    </span>
                  )}
                </div>
                <span className="text-[13px] leading-relaxed text-white/45">{p.description}</span>
              </div>
            </>
          );
          return p.liveUrl ? (
            <a key={p.id} href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-start gap-3.5">
              {body}
            </a>
          ) : (
            <div key={p.id} className="flex items-start gap-3.5">{body}</div>
          );
        })}
      </div>
    </section>
  );
}
