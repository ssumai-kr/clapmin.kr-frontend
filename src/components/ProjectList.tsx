import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { Project } from "../types/api";
import { projects as hardcodedProjects } from "../data/projects";
import ProjectCard from "./ProjectCard";

function mergeWithHardcoded(apiProjects: Project[]): Project[] {
  const apiIds = new Set(apiProjects.map((p) => p.title));
  const fallbacks: Project[] = hardcodedProjects
    .filter((p) => !apiIds.has(p.title))
    .map((p, i) => ({
      id: -(i + 1),
      title: p.title,
      description: p.description,
      tags: p.tags,
      github_url: p.githubUrl ?? null,
      live_url: p.liveUrl ?? null,
      image_url: p.imageUrl ?? null,
      image_contain: p.imageContain ?? false,
      order: i,
      created_at: "",
      updated_at: null,
    }));
  return [...apiProjects, ...fallbacks].sort((a, b) => a.order - b.order);
}

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setProjects(mergeWithHardcoded(data)))
      .catch(() => {
        setError(true);
        setProjects(mergeWithHardcoded([]));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="mb-10">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Projects{" "}
        {!loading && !error && (
          <span className="ml-1 text-sm font-normal text-muted-foreground">
            {projects.length} projects
          </span>
        )}
      </h2>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      )}

      {error && projects.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          프로젝트를 불러오지 못했습니다.
        </p>
      )}

      {!loading && projects.length === 0 && !error && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No projects yet.
        </p>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
