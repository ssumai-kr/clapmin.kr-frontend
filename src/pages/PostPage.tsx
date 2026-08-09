import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { apiFetch, apiFetchAuth } from "../lib/api";
import type { PostDetail } from "../types/api";
import { posts as hardcodedPosts } from "../data/posts";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LikeButton from "../components/LikeButton";
import QuoteFooter from "../components/minimal/QuoteFooter";
import AskDock from "../components/minimal/AskDock";
import { useAuth } from "../context/AuthContext";

/** 홈·목록 페이지와 같은 톤의 껍데기. */
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="min-h-screen bg-[#171717] px-6 pb-[140px] pt-16 sm:pt-24"
        style={{ animation: "clapmin-page-in .5s ease both" }}
      >
        <div className="mx-auto flex max-w-[680px] flex-col gap-14">{children}</div>
      </div>
      <AskDock />
    </>
  );
}

const backLink =
  "inline-flex w-fit items-center gap-1.5 text-[12.5px] text-white/40 transition-colors hover:text-white";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!post || !window.confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;
    setIsDeleting(true);
    try {
      const res = await apiFetchAuth(`/api/posts/${post.slug}`, token!, { method: "DELETE" });
      if (!res.ok) throw new Error();
      navigate("/");
    } catch {
      alert("삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);

    apiFetch(`/api/posts/${slug}`)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: PostDetail | null) => {
        if (cancelled) return;
        if (data) {
          setPost(data);
          apiFetch(`/api/posts/${slug}/view`, { method: "POST" });
          return;
        }
        // API에 없으면 하드코딩 데이터에서 찾기
        const hardcoded = hardcodedPosts.find((p) => p.slug === slug);
        if (hardcoded) {
          setPost({
            id: -Number(hardcoded.id),
            title: hardcoded.title,
            slug: hardcoded.slug,
            excerpt: hardcoded.excerpt,
            content: hardcoded.content,
            date: hardcoded.date,
            tags: hardcoded.tags,
            view_count: 0,
            like_count: 0,
            created_at: hardcoded.date,
            updated_at: null,
          });
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        const hardcoded = hardcodedPosts.find((p) => p.slug === slug);
        if (hardcoded) {
          setPost({
            id: -Number(hardcoded.id),
            title: hardcoded.title,
            slug: hardcoded.slug,
            excerpt: hardcoded.excerpt,
            content: hardcoded.content,
            date: hardcoded.date,
            tags: hardcoded.tags,
            view_count: 0,
            like_count: 0,
            created_at: hardcoded.date,
            updated_at: null,
          });
        } else {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Shell>
        <p className="text-[13px] text-white/35">loading…</p>
      </Shell>
    );
  }

  if (notFound || !post) {
    return (
      <Shell>
        <div className="flex flex-col gap-4">
          <p className="text-[13.5px] text-white/45">Post not found.</p>
          <Link to="/posts" className={backLink}>
            <ArrowLeft className="h-3.5 w-3.5" />
            back to posts
          </Link>
        </div>
      </Shell>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Shell>
      <header className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/posts" className={backLink}>
            <ArrowLeft className="h-3.5 w-3.5" />
            back to posts
          </Link>
          {isAuthenticated && post.id > 0 && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 text-[12.5px] text-white/40 transition-colors hover:text-white disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-[7px]">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/[0.06] bg-[#2B2B2B] px-[9px] py-[3px] font-mono text-[11px] text-white/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-[22px] font-medium leading-[1.35] tracking-[-0.01em] text-white [text-wrap:pretty] sm:text-[26px]">
          {post.title}
        </h1>

        <p className="text-[13.5px] leading-[1.75] text-white/45 [text-wrap:pretty]">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-4 text-[12px] text-white/35">
          <time>{formattedDate}</time>
          <span>조회 {post.view_count.toLocaleString()}</span>
          <LikeButton slug={post.slug} initialCount={post.like_count} />
        </div>
      </header>

      <article>
        <MarkdownRenderer content={post.content} />
      </article>

      <QuoteFooter />
    </Shell>
  );
}
