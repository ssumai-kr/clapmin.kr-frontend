import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { apiFetch } from "../lib/api";
import type { PostDetail } from "../types/api";
import { posts as hardcodedPosts } from "../data/posts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import LikeButton from "../components/LikeButton";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

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
