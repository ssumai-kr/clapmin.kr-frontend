import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../types/api";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glow-card group overflow-hidden rounded-xl border border-white/8 bg-card/60 backdrop-blur">
      {project.image_url && (
        <div
          className={`relative aspect-video w-full overflow-hidden ${
            project.image_contain
              ? "bg-gradient-to-br from-zinc-100 to-zinc-300"
              : "bg-zinc-800"
          }`}
        >
          <img
            src={project.image_url}
            alt={project.title}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
              project.image_contain ? "object-contain p-5" : "object-cover"
            }`}
          />
          {!project.image_contain && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          )}
        </div>
      )}

      <div className="relative z-[2] flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-[hsl(var(--brand-1))]">
            {project.title}
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="ml-3 flex flex-shrink-0 items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub repository"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Live site"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
