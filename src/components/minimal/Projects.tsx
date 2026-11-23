import { useState } from "react";
import { projects } from "../../data/projects";
import { findProjectDetail } from "../../data/projectDetails";
import ProjectDetailModal from "./ProjectDetailModal";

export default function Projects() {
  // 팝업을 띄울 프로젝트 id. 상세 데이터가 있는 항목만 여기에 들어온다.
  const [openId, setOpenId] = useState<string | null>(null);

  const openProject = projects.find((p) => p.id === openId);
  const openDetail = openProject
    ? findProjectDetail(openProject.title)
    : undefined;

  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">
        Projects
      </h2>
      <div className="flex flex-col gap-[18px]">
        {projects.map((p) => {
          const detail = findProjectDetail(p.title);
          const body = (
            <>
              <img
                src={p.imageUrl}
                alt={p.title}
                className={`h-[34px] w-[34px] flex-shrink-0 rounded-lg border border-white/[0.06] bg-[#2B2B2B] ${
                  p.imageContain ? "object-contain p-[5px]" : "object-cover"
                }`}
              />
              <div className="flex min-w-0 flex-col gap-[3px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-medium text-white">
                    {p.title}
                  </span>
                  {p.liveUrl && (
                    <span className="rounded-full bg-[#2B2B2B] px-[7px] py-0.5 text-[10.5px] text-white/50">
                      Live
                    </span>
                  )}
                </div>
                <span className="text-[13px] leading-relaxed text-white/45">
                  {p.description}
                </span>
                {detail && (
                  <span className="mt-[2px] text-[11.5px] text-white/30 transition-colors group-hover:text-white/55">
                    what I built →
                  </span>
                )}
              </div>
            </>
          );

          // 상세가 있으면 클릭 시 팝업, 없으면 기존처럼 외부 링크로 나간다.
          if (detail) {
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpenId(p.id)}
                aria-haspopup="dialog"
                className="group -m-1.5 flex items-start gap-3.5 rounded-xl p-1.5 text-left outline-none transition-colors focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-white/20"
              >
                {body}
              </button>
            );
          }
          return p.liveUrl ? (
            <a
              key={p.id}
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3.5"
            >
              {body}
            </a>
          ) : (
            <div key={p.id} className="group flex items-start gap-3.5">
              {body}
            </div>
          );
        })}
      </div>

      {openProject && openDetail && (
        <ProjectDetailModal
          title={openProject.title}
          detail={openDetail}
          imageUrl={openProject.imageUrl}
          imageContain={openProject.imageContain}
          liveUrl={openProject.liveUrl}
          githubUrl={openProject.githubUrl}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
