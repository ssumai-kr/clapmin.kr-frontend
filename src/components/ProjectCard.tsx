import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../types/api";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-foreground/30 hover:shadow-md">
      {project.image_url && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={project.image_url}
            alt={project.title}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${
              project.image_contain ? "object-contain p-4" : "object-cover"
            }`}
          />
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">
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
