import { Calendar, ArrowRight } from "lucide-react";
import type { Post } from "../data/posts";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-foreground/30 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <time>{formattedDate}</time>
      </div>

      <h2 className="mb-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {post.title}
      </h2>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
        <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
    </article>
  );
}
