import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, ArrowRight } from "lucide-react";
import { apiFetch, apiFetchAuth } from "../lib/api";
import type { PostSummary } from "../types/api";
import { posts as hardcodedPosts } from "../data/posts";
import { useAuth } from "../context/AuthContext";
import PostCard from "./PostCard";

function mergeWithHardcoded(apiPosts: PostSummary[]): PostSummary[] {
  const apiSlugs = new Set(apiPosts.map((p) => p.slug));
  const fallbacks: PostSummary[] = hardcodedPosts
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

export default function PostList({ limit }: { limit?: number } = {}) {
  const { isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function handleDelete(slug: string) {
    try {
      await apiFetchAuth(`/api/posts/${slug}`, token!, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  useEffect(() => {
    apiFetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setPosts(mergeWithHardcoded(data)))
      .catch(() => {
        setError(true);
        setPosts(mergeWithHardcoded([]));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="posts">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-xl font-bold text-foreground">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[hsl(var(--brand-2))] to-[hsl(var(--brand-1))]" />
          Posts
          {!loading && !error && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {posts.length}
            </span>
          )}
        </h2>
        {isAuthenticated && (
          <Link
            to="/posts/write"
            className="btn-gradient flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
          >
            <PenLine className="h-3.5 w-3.5" />
            글쓰기
          </Link>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      )}

      {error && posts.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          게시글을 불러오지 못했습니다.
        </p>
      )}

      {!loading && posts.length === 0 && !error && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No posts yet.
        </p>
      )}

      {!loading && posts.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {(limit ? posts.slice(0, limit) : posts).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={isAuthenticated && post.id > 0 ? handleDelete : undefined}
              />
            ))}
          </div>

          {limit !== undefined && posts.length > limit && (
            <div className="mt-7 flex justify-center">
              <Link
                to="/posts"
                className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-foreground/90 backdrop-blur transition-all hover:border-[hsl(var(--brand-1)/0.5)] hover:bg-white/10"
              >
                포스트 더보기
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
