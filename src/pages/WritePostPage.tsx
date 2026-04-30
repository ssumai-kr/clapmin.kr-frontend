import { useState, useEffect, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetchAuth } from "../lib/api";
import MarkdownRenderer from "../components/MarkdownRenderer";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function WritePostPage() {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(todayString());
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 타이틀 변경 시 slug 자동 생성 (사용자가 직접 수정한 경우엔 유지)
  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await apiFetchAuth("/api/posts", token!, {
        method: "POST",
        body: JSON.stringify({ title, slug, excerpt, date, tags: tagList, content }),
      });

      if (res.status === 409) {
        setError("이미 사용 중인 slug입니다.");
        return;
      }
      if (!res.ok) {
        setError("게시글 작성에 실패했습니다.");
        return;
      }

      navigate(`/posts/${slug}`);
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground";

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 바 */}
      <div className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>

          <span className="text-sm font-semibold text-foreground">새 글 작성</span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {preview ? "에디터" : "프리뷰"}
            </button>
            <button
              form="write-form"
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {loading ? "발행 중..." : "발행"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
        {/* 메타 필드 */}
        <form id="write-form" onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                제목 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="포스트 제목"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
                placeholder="url-friendly-slug"
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                날짜 *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                요약 *
              </label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                placeholder="포스트 요약 (목록에 표시됩니다)"
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, typescript, web"
                className={inputCls}
              />
            </div>

            {error && (
              <div className="sm:col-span-2 lg:col-span-4">
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* 에디터 / 프리뷰 */}
          {preview ? (
            <div className="rounded-xl border border-border bg-card p-8">
              {content ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  내용을 입력하면 여기서 미리볼 수 있습니다.
                </p>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="마크다운으로 작성하세요..."
              className="h-[calc(100vh-22rem)] w-full resize-none rounded-xl border border-input bg-background px-5 py-4 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground"
            />
          )}
        </form>
      </div>
    </div>
  );
}
