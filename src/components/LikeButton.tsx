import { useState } from "react";
import { Heart } from "lucide-react";
import { apiFetch } from "../lib/api";

interface Props {
  slug: string;
  initialCount: number;
}

const storageKey = (slug: string) => `liked:${slug}`;

export default function LikeButton({ slug, initialCount }: Props) {
  const [liked, setLiked] = useState(
    () => localStorage.getItem(storageKey(slug)) === "1"
  );
  const [count, setCount] = useState(initialCount);

  async function toggle() {
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    localStorage.setItem(storageKey(slug), next ? "1" : "0");

    await apiFetch(`/api/posts/${slug}/like`, {
      method: next ? "POST" : "DELETE",
    });
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
        liked
          ? "border-pink-500 text-pink-500"
          : "border-border text-muted-foreground hover:border-pink-400 hover:text-pink-400"
      }`}
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-pink-500" : ""}`} />
      {count}
    </button>
  );
}
