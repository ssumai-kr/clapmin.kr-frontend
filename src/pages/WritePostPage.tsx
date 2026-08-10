import { useRef, useEffect, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, apiFetchAuth } from "../lib/api";
import type { PostDetail } from "../types/api";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { useState } from "react";

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
  const { slug: editSlug } = useParams<{ slug?: string }>();
  const isEditMode = Boolean(editSlug);
  const editorRef = useRef<InstanceType<typeof Editor>>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // 수정 모드에서는 기존 slug를 그대로 유지 — 제목 변경으로 URL이 바뀌면 안 되므로.
  const [slugEdited, setSlugEdited] = useState(isEditMode);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(todayString());
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(!isEditMode);

  useEffect(() => {
    if (!slugEdited) setSlug(toSlug(title));
  }, [title, slugEdited]);

  // 수정 모드: 기존 글을 불러와 폼을 채운다.
  useEffect(() => {
    if (!isEditMode) return;
    let cancelled = false;

    apiFetch(`/api/posts/${editSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((post: PostDetail) => {
        if (cancelled) return;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setDate(post.date);
        setTags(post.tags.join(", "));
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setError("게시글을 불러오지 못했습니다.");
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isEditMode, editSlug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const markdown = editorRef.current?.getInstance().getMarkdown() ?? "";
    if (!markdown.trim()) {
      setError("내용을 입력하세요.");
      return;
    }

    setLoading(true);

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = JSON.stringify({
      title,
      slug,
      excerpt,
      date,
      tags: tagList,
      content: markdown,
    });

    try {
      const res = isEditMode
        ? await apiFetchAuth(`/api/posts/${editSlug}`, token!, {
            method: "PUT",
            body,
          })
        : await apiFetchAuth("/api/posts", token!, { method: "POST", body });

      if (res.status === 409) {
        setError("이미 사용 중인 slug입니다.");
        return;
      }
      if (!res.ok) {
        setError(
          isEditMode
            ? "게시글 수정에 실패했습니다."
            : "게시글 작성에 실패했습니다."
        );
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
            to={isEditMode ? `/posts/${editSlug}` : "/"}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {isEditMode ? "포스트로" : "홈으로"}
          </Link>

          <span className="text-sm font-semibold text-foreground">
            {isEditMode ? "글 수정" : "새 글 작성"}
          </span>

          <button
            form="write-form"
            type="submit"
            disabled={loading || !ready}
            className="flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {isEditMode
              ? loading
                ? "수정 중..."
                : "수정 완료"
              : loading
                ? "발행 중..."
                : "발행"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6">
        <form id="write-form" onSubmit={handleSubmit}>
          {/* 메타 필드 */}
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

          {/* Toast UI Editor — initialValue는 마운트 시점에만 반영되므로 로딩 후 렌더 */}
          <div className="overflow-hidden rounded-xl border border-border">
            {ready ? (
              <Editor
                ref={editorRef}
                initialValue={content}
                previewStyle="vertical"
                initialEditType="markdown"
                height="calc(100vh - 22rem)"
                theme="dark"
                useCommandShortcut
                placeholder="마크다운으로 작성하세요..."
              />
            ) : (
              <div
                className="flex items-center justify-center text-sm text-muted-foreground"
                style={{ height: "calc(100vh - 22rem)" }}
              >
                불러오는 중…
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
