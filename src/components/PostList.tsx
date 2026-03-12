import { posts } from "../data/posts";
import PostCard from "./PostCard";

export default function PostList() {
  return (
    <section id="posts">
      <h2 className="mb-4 text-lg font-bold text-foreground">
        Posts{" "}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          {posts.length} articles
        </span>
      </h2>
      {posts.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          아직 등록된 포스트가 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
