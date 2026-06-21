import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { apiFetch } from "../lib/api";
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

export default function PostList() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">
          Posts{" "}
          {!loading && !error && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              {posts.length} articles
            </span>
          )}
        </h2>
        {isAuthenticated && (
          <Link
            to="/posts/write"
            className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
