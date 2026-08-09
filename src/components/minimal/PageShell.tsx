import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import clapminLogo from "../../images/clapminLogo.png";
import QuoteFooter from "./QuoteFooter";
import AskDock from "./AskDock";

interface Props {
  title: string;
  description?: string;
  /** 제목 오른쪽에 붙는 액션 (예: 글쓰기 버튼). */
  action?: React.ReactNode;
  children: React.ReactNode;
}

/** 홈(MinimalHome)과 동일한 톤·여백을 쓰는 하위 페이지 레이아웃. */
export default function PageShell({ title, description, action, children }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div
        className="min-h-screen bg-[#171717] px-6 pb-[140px] pt-16 sm:pt-24"
        style={{ animation: "clapmin-page-in .5s ease both" }}
      >
        <div className="mx-auto flex max-w-[620px] flex-col gap-14">
          <header className="flex flex-col gap-5">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-1.5 text-[12.5px] text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              back
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={clapminLogo}
                  alt="clapmin"
                  className="h-[22px] w-[22px] flex-shrink-0 rounded-[5px]"
                />
                <h1 className="text-[15px] font-medium tracking-[-0.01em] text-white">
                  {title}
                </h1>
              </div>
              {action}
            </div>
            {description && (
              <p className="text-[13.5px] leading-[1.75] text-white/45 [text-wrap:pretty]">
                {description}
              </p>
            )}
          </header>

          {children}

          <QuoteFooter />
        </div>
      </div>
      <AskDock />
    </>
  );
}
