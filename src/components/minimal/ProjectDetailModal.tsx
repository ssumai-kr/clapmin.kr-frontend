import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, Github } from "lucide-react";
import type { ProjectDetail } from "../../data/projectDetails";

interface Props {
  title: string;
  detail: ProjectDetail;
  imageUrl?: string | null;
  imageContain?: boolean;
  liveUrl?: string | null;
  githubUrl?: string | null;
  onClose: () => void;
}

/** 모달 안에서만 Tab 이 돌도록 가두기 위한 선택자. */
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[3px]">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">
        {label}
      </span>
      <span className="text-[12.5px] leading-[1.65] text-white/60 [text-wrap:pretty]">
        {value}
      </span>
    </div>
  );
}

/**
 * 프로젝트 구현 내용 팝업.
 *
 * ESC·배경 클릭·닫기 버튼으로 닫히고, 열려 있는 동안 본문 스크롤을 잠그며
 * 포커스를 모달 안에 두었다가 닫힐 때 호출한 요소로 되돌린다.
 */
export default function ProjectDetailModal({
  title,
  detail,
  imageUrl,
  imageContain,
  liveUrl,
  githubUrl,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === panelRef.current)
      ) {
        e.preventDefault();
        last.focus();
      }
    };

    // capture 단계에서 받아, AskDock 의 전역 ESC 핸들러보다 먼저 처리한다.
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-black/70 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      style={{ animation: "clapmin-page-in .18s ease both" }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[620px] flex-col overflow-hidden rounded-t-2xl border border-white/[0.08] bg-[#1C1C1C] outline-none sm:max-h-[86vh] sm:rounded-2xl"
        style={{
          animation: "clapmin-sheet-in .24s cubic-bezier(.22,.8,.3,1) both",
          boxShadow: "0 24px 70px -12px rgba(0,0,0,0.7)",
        }}
      >
        {/* 헤더 — 스크롤해도 제목과 닫기 버튼은 남는다. */}
        <div className="flex items-start gap-3.5 border-b border-white/[0.06] bg-[#1C1C1C] px-5 py-[18px] sm:px-7">
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className={`h-[34px] w-[34px] flex-shrink-0 rounded-lg border border-white/[0.06] bg-[#2B2B2B] ${
                imageContain ? "object-contain p-[5px]" : "object-cover"
              }`}
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <h2
              id="project-detail-title"
              className="text-[14.5px] font-medium tracking-[-0.01em] text-white"
            >
              {title}
            </h2>
            <span className="text-[12px] text-white/40">{detail.period}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-[15px] w-[15px]" />
          </button>
        </div>

        <div className="flex flex-col gap-7 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          <p className="text-[13.5px] leading-[1.75] text-white/65 [text-wrap:pretty]">
            {detail.summary}
          </p>

          {detail.status && (
            <p className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-[15px] py-3 text-[12.5px] leading-[1.7] text-white/50 [text-wrap:pretty]">
              {detail.status}
            </p>
          )}

          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <Meta label="Role" value={detail.role} />
            {detail.team && <Meta label="Team" value={detail.team} />}
          </div>

          {detail.scale && detail.scale.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">
                Contribution
              </span>
              <ul className="flex flex-col gap-[7px]">
                {detail.scale.map((item) => (
                  <li
                    key={item}
                    className="text-[12.5px] leading-[1.7] text-white/55 [text-wrap:pretty]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">
              Stack
            </span>
            <div className="flex flex-wrap gap-[7px]">
              {detail.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/[0.06] bg-[#2B2B2B] px-[9px] py-[3px] font-mono text-[11px] text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/[0.06] pt-7">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/30">
              What I implemented
            </span>
            {detail.sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2.5">
                <h3 className="text-[13px] font-medium text-white">
                  {section.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden className="pt-[7px] text-white/20">
                        <span className="block h-[3px] w-[3px] rounded-full bg-current" />
                      </span>
                      <span className="text-[13px] leading-[1.75] text-white/55 [text-wrap:pretty]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {(liveUrl || githubUrl) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/[0.06] pt-6 text-[12.5px]">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 border-b border-white/15 text-white/55 transition-colors hover:border-white/40 hover:text-white"
                >
                  visit
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border-b border-white/15 text-white/55 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Github className="h-3 w-3" />
                  source
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
