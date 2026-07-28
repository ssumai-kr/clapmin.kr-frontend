import { useRef } from "react";
import { Github, Mail, GraduationCap, Trophy, Briefcase } from "lucide-react";
import itsSupportCard from "../images/itssupportcard.png";
import sapLogo from "../images/sap.png";
import GitHubContributions from "./GitHubContributions";
import TextType from "./TextType";

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt following the pointer over the business card.
  function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(
      2
    )}deg) rotateY(${(px * 12).toFixed(2)}deg) scale(1.02)`;
  }
  function resetTilt() {
    if (cardRef.current)
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0) rotateY(0) scale(1)";
  }

  return (
    <section className="px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          {/* Business card image with tilt + glow */}
          <div className="w-full max-w-xs flex-shrink-0 md:w-72 md:max-w-none">
            <div
              ref={cardRef}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
              className="relative rounded-2xl transition-transform duration-200 ease-out will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[hsl(var(--brand-1)/0.5)] via-[hsl(var(--brand-2)/0.35)] to-[hsl(var(--brand-3)/0.5)] opacity-60 blur-xl" />
              <img
                src={itsSupportCard}
                alt="Park Sumin - IT Support Card"
                className="relative w-full rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
          </div>

          {/* Profile info */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Software Developer
            </p>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="gradient-text">Park Sumin</span>
            </h1>

            <div className="mb-5 h-6 text-lg font-semibold text-foreground/90">
              <TextType
                as="span"
                text={[
                  "Web Software Developer",
                  "SAP ERP Developer",
                  "FullStack Engineer",
                  "Problem Solver",
                ]}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={1600}
                loop
                showCursor
                cursorCharacter="▍"
                cursorClassName="text-[hsl(var(--brand-1))]"
              />
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
                Web Software Developer
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur">
                ERP Developer
                <img src={sapLogo} alt="SAP" className="h-3.5 w-6" />
              </span>
            </div>

            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground md:mx-0">
              Developer focused on web software development and SAP ERP systems.
            </p>

            {/* Education */}
            <div className="mb-6 flex items-start justify-center gap-2 md:justify-start">
              <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--brand-1))]" />
              <div className="text-left text-sm">
                <p className="font-medium text-foreground">
                  Soongsil University
                </p>
                <p className="text-muted-foreground">Business Administration</p>
                <p className="text-muted-foreground">
                  Computer Science and Engineering
                </p>
              </div>
            </div>

            {/* Awards */}
            <div className="mb-6 flex items-start justify-center gap-2 md:justify-start">
              <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--brand-2))]" />
              <div className="space-y-1.5 text-left text-sm">
                <div>
                  <p className="font-medium text-foreground">
                    Excellence Award
                  </p>
                  <p className="text-muted-foreground">
                    Soongsil University Startup Hackathon · Soongsil University
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Chairman's Award
                  </p>
                  <p className="text-muted-foreground">
                    K-PaaS Application Contest · NIA / CCCR
                  </p>
                </div>
              </div>
            </div>

            {/* Career */}
            <div className="mb-6 flex items-start justify-center gap-2 md:justify-start">
              <Briefcase className="mt-0.5 h-4 w-4 flex-shrink-0 text-[hsl(var(--brand-3))]" />
              <div className="space-y-1.5 text-left text-sm">
                <div>
                  <p className="font-medium text-foreground">
                    FullStack Engineer
                  </p>
                  <p className="text-muted-foreground">Depart · 26.07 ~</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 md:justify-start">
              <a
                href="https://github.com/ssumai-kr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="mailto:fhsjdvs@gmail.com"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>

            <GitHubContributions />
          </div>
        </div>
      </div>
    </section>
  );
}
