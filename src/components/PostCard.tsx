import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Trash2 } from "lucide-react";
import type { PostSummary } from "../types/api";

interface PostCardProps {
  post: PostSummary;
  onDelete?: (slug: string) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`"${post.title}" 포스트를 삭제하시겠습니까?`)) return;
    onDelete?.(post.slug);
  }

  return (
    <Link to={`/posts/${post.slug}`}>
      <article className="glow-card group h-full cursor-pointer rounded-xl border border-white/8 bg-card/60 p-5 backdrop-blur">
        <div className="relative z-[2] mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <time>{formattedDate}</time>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              title="삭제"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <h2 className="relative z-[2] mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-[hsl(var(--brand-1))]">
          {post.title}
        </h2>

        <p className="relative z-[2] mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="relative z-[2] flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground/70"
              >
                #{tag}
              </span>
            ))}
          </div>
          <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-[hsl(var(--brand-1))]" />
        </div>
      </article>
    </Link>
  );
}
