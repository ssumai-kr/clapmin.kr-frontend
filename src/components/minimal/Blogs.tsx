import { Link } from "react-router-dom";
import { posts } from "../../data/posts";

export default function Blogs({ limit = 4 }: { limit?: number }) {
  return (
    <section>
      <h2 className="mb-[18px] text-[13.5px] font-medium text-white">Blogs</h2>
      <div className="flex flex-col gap-4">
        {posts.slice(0, limit).map((p) => (
          <Link key={p.id} to={`/posts/${p.slug}`} className="flex flex-col gap-[3px]">
            <span className="text-[13.5px] font-medium text-white">{p.title}</span>
            <span className="text-[12px] text-white/35">
              {new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </Link>
        ))}
      </div>
      <Link to="/posts" className="mt-[18px] inline-block border-b border-white/20 text-[12.5px] text-white/45">
        more
      </Link>
    </section>
  );
}
