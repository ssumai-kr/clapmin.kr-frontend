import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
  return (
    <section id="projects" className="mb-10">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Projects{" "}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          {projects.length} projects
        </span>
      </h2>
      {projects.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No projects yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
