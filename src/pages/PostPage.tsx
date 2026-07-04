import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import { apiFetch, apiFetchAuth } from "../lib/api";
import type { PostDetail } from "../types/api";
import { posts as hardcodedPosts } from "../data/posts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LikeButton from "../components/LikeButton";
import { useAuth } from "../context/AuthContext";

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center pt-48">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <p className="text-muted-foreground">Post not found.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          {isAuthenticated && post.id > 0 && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          )}
        </div>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <time>{formattedDate}</time>
            </div>
            <span>조회 {post.view_count.toLocaleString()}</span>
            <LikeButton slug={post.slug} initialCount={post.like_count} />
          </div>
        </header>

        <article>
          <MarkdownRenderer content={post.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
