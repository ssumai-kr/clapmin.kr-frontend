import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, Trash2 } from "lucide-react";
import type { PostSummary } from "../types/api";
import { fetchPosts, formatDate } from "../lib/content";
import { apiFetchAuth } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import PageShell from "../components/minimal/PageShell";

export default function PostsPage() {
  const { isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPosts().then((res) => {
      if (cancelled) return;
      setPosts(res.items);
      setFailed(res.failed);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(post: PostSummary) {
    if (!window.confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;
    try {
      const res = await apiFetchAuth(`/api/posts/${post.slug}`, token!, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <PageShell
      title="Posts"
      description="Notes on the things I build and the tools I build them with — written when something is worth remembering."
      action={
        isAuthenticated && (
          <Link
            to="/posts/write"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#2B2B2B] px-[11px] py-[5px] text-[11.5px] text-white/70 transition-colors hover:text-white"
          >
            <PenLine className="h-3 w-3" />
            글쓰기
          </Link>
        )
      }
    >
      <section>
        {loading && <p className="text-[13px] text-white/35">loading…</p>}

        {!loading && posts.length === 0 && (
          <p className="text-[13px] text-white/35">
            {failed ? "게시글을 불러오지 못했습니다." : "No posts yet."}
          </p>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex flex-col gap-7">
            {posts.map((post) => (
              <article key={post.id} className="flex items-start justify-between gap-4">
                <Link
                  to={`/posts/${post.slug}`}
                  className="group flex min-w-0 flex-1 flex-col gap-[5px]"
                >
                  <span className="text-[13.5px] font-medium text-white [text-wrap:pretty]">
                    {post.title}
                  </span>
                  <span className="line-clamp-2 text-[13px] leading-relaxed text-white/45 [text-wrap:pretty]">
                    {post.excerpt}
                  </span>
                  <span className="mt-[3px] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-white/35">
                    <span>{formatDate(post.date)}</span>
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="font-mono text-[11.5px] text-white/30">
                        #{tag}
                      </span>
                    ))}
                  </span>
                </Link>
                {isAuthenticated && post.id > 0 && (
                  <button
                    onClick={() => handleDelete(post)}
                    aria-label={`${post.title} 삭제`}
                    className="flex-shrink-0 p-1 text-white/25 transition-colors hover:text-white/70"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
