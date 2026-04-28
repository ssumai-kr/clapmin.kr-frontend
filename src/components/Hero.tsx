import { Github, Mail, GraduationCap, Trophy } from "lucide-react";
import itsSupportCard from "../images/itssupportcard.png";
import sapLogo from "../images/sap.png";
import GitHubContributions from "./GitHubContributions";

export default function Hero() {
  return (
    <section className="px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          {/* Business card image */}
          <div className="w-full max-w-xs flex-shrink-0 md:w-72 md:max-w-none">
            <img
              src={itsSupportCard}
              alt="Park Sumin - IT Support Card"
              className="w-full rounded-2xl border border-border shadow-lg"
            />
          </div>

          {/* Profile info */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Software Developer
            </p>
            <h1 className="mb-1 text-4xl font-bold text-foreground sm:text-5xl">
              Park Sumin
            </h1>

            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                Web Software Developer
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                ERP Developer
                <img src={sapLogo} alt="SAP" className="h-3.5 w-6" />
              </span>
            </div>

            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted-foreground md:mx-0">
              Developer focused on web software development and SAP ERP systems.
            </p>

            {/* Education */}
            <div className="mb-6 flex items-start justify-center gap-2 md:justify-start">
              <GraduationCap className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
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
              <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
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

            <div className="flex items-center justify-center gap-3 md:justify-start">
              <a
                href="https://github.com/ssumai-kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="mailto:fhsjdvs@gmail.com"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
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
