import { apiFetch } from "./api";
import type { PostSummary, Project } from "../types/api";
import { posts as localPosts } from "../data/posts";
import { projects as localProjects } from "../data/projects";

/** 하드코딩 포스트를 API 응답에 없는 것만 채워 넣고 최신순으로 정렬한다. */
function mergePosts(apiPosts: PostSummary[]): PostSummary[] {
  const apiSlugs = new Set(apiPosts.map((p) => p.slug));
  const fallbacks: PostSummary[] = localPosts
    .filter((p) => !apiSlugs.has(p.slug))
    .map((p) => ({
      id: -Number(p.id),
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      date: p.date,
      tags: p.tags,
      view_count: 0,
      created_at: p.date,
      updated_at: null,
    }));
  return [...apiPosts, ...fallbacks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function mergeProjects(apiProjects: Project[]): Project[] {
  const apiTitles = new Set(apiProjects.map((p) => p.title));
  const fallbacks: Project[] = localProjects
    .filter((p) => !apiTitles.has(p.title))
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

export interface ContentResult<T> {
  items: T[];
  /** API 호출이 실패해 하드코딩 데이터만 담겨 있는 경우 true. */
  failed: boolean;
}

async function load<T>(path: string, merge: (data: T[]) => T[]): Promise<ContentResult<T>> {
  try {
    const res = await apiFetch(path);
    if (!res.ok) throw new Error(String(res.status));
    return { items: merge(await res.json()), failed: false };
  } catch {
    return { items: merge([]), failed: true };
  }
}

/** 최신순으로 정렬된 포스트 목록 (API + 하드코딩 폴백). */
export function fetchPosts(): Promise<ContentResult<PostSummary>> {
  return load<PostSummary>("/api/posts", mergePosts);
}

/** order 순으로 정렬된 프로젝트 목록 (API + 하드코딩 폴백). */
export function fetchProjects(): Promise<ContentResult<Project>> {
  return load<Project>("/api/projects", mergeProjects);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
