import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PostSummary } from "../../types/api";
import { fetchPosts, formatDate } from "../../lib/content";

export default function Blogs({ limit = 3 }: { limit?: number }) {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPosts().then(({ items }) => {
      if (cancelled) return;
      setPosts(items.slice(0, limit));
      setTotal(items.length);
    });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (posts.length === 0) return null;

  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Blogs</h2>
      <div className="flex flex-col gap-4">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/posts/${p.slug}`}
            className="group flex flex-col gap-[3px]"
          >
            <span className="text-[13.5px] font-medium text-white [text-wrap:pretty]">
              {p.title}
            </span>
            <span className="text-[12px] text-white/35">{formatDate(p.date)}</span>
          </Link>
        ))}
      </div>
      {total > posts.length && (
        <Link
          to="/posts"
          className="mt-[18px] inline-block border-b border-white/20 text-[12.5px] text-white/45 transition-colors hover:border-white/40 hover:text-white"
        >
          more
        </Link>
      )}
    </section>
  );
}
