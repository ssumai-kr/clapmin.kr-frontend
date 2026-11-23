import { useEffect, useState } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import type { Project } from "../types/api";
import { fetchProjects } from "../lib/content";
import { findProjectDetail } from "../data/projectDetails";
import PageShell from "../components/minimal/PageShell";
import ProjectDetailModal from "../components/minimal/ProjectDetailModal";

function Card({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const detail = findProjectDetail(project.title);

  const summary = (
    <>
      {project.image_url && (
        <img
          src={project.image_url}
          alt={project.title}
          className={`h-[34px] w-[34px] flex-shrink-0 rounded-lg border border-white/[0.06] bg-[#2B2B2B] ${
            project.image_contain ? "object-contain p-[5px]" : "object-cover"
          }`}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-medium text-white">
            {project.title}
          </span>
          {project.live_url && (
            <span className="rounded-full bg-[#2B2B2B] px-[7px] py-0.5 text-[10.5px] text-white/50">
              Live
            </span>
          )}
        </div>
        <span className="text-[13px] leading-relaxed text-white/45 [text-wrap:pretty]">
          {project.description}
        </span>
        {project.tags.length > 0 && (
          <div className="mt-[3px] flex flex-wrap gap-[7px]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.06] bg-[#2B2B2B] px-[9px] py-[3px] font-mono text-[11px] text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {detail && (
          <span className="mt-[3px] text-[11.5px] text-white/30 transition-colors group-hover:text-white/55">
            what I built →
          </span>
        )}
      </div>
    </>
  );

  const links = (project.live_url || project.github_url) && (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] ${
        project.image_url ? "pl-[48px]" : ""
      }`}
    >
      {project.live_url && (
        <a
          href={project.live_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 border-b border-white/15 text-white/55 transition-colors hover:border-white/40 hover:text-white"
        >
          visit
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 border-b border-white/15 text-white/55 transition-colors hover:border-white/40 hover:text-white"
        >
          <Github className="h-3 w-3" />
          source
        </a>
      )}
    </div>
  );

  // 상세가 있는 프로젝트만 클릭 가능한 카드가 된다.
  // 링크는 버튼 밖에 둬야 하므로(중첩 금지) 요약 영역만 버튼으로 감싼다.
  return (
    <article className="flex flex-col gap-[9px]">
      {detail ? (
        <button
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          className="group -m-1.5 flex items-start gap-3.5 rounded-xl p-1.5 text-left outline-none transition-colors focus-visible:bg-white/[0.04] focus-visible:ring-1 focus-visible:ring-white/20"
        >
          {summary}
        </button>
      ) : (
        <div className="flex items-start gap-3.5">{summary}</div>
      )}
      {links}
    </article>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProjects().then((res) => {
      if (cancelled) return;
      setProjects(res.items);
      setFailed(res.failed);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openProject = projects.find((p) => p.id === openId);
  const openDetail = openProject
    ? findProjectDetail(openProject.title)
    : undefined;

  return (
    <PageShell
      title="Projects"
      description="Products and sites I've shipped — most of them still running in production. Open one to read what I actually built in it."
    >
      <section>
        {loading && <p className="text-[13px] text-white/35">loading…</p>}

        {!loading && projects.length === 0 && (
          <p className="text-[13px] text-white/35">
            {failed ? "프로젝트를 불러오지 못했습니다." : "No projects yet."}
          </p>
        )}

        {!loading && projects.length > 0 && (
          <div className="flex flex-col gap-7">
            {projects.map((project) => (
              <Card
                key={project.id}
                project={project}
                onOpen={() => setOpenId(project.id)}
              />
            ))}
          </div>
        )}
      </section>

      {openProject && openDetail && (
        <ProjectDetailModal
          title={openProject.title}
          detail={openDetail}
          imageUrl={openProject.image_url}
          imageContain={openProject.image_contain}
          liveUrl={openProject.live_url}
          githubUrl={openProject.github_url}
          onClose={() => setOpenId(null)}
        />
      )}
    </PageShell>
  );
}
