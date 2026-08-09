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
      className={`flex items-center gap-1.5 rounded-full border px-[9px] py-[3px] text-[12px] transition-colors ${
        liked
          ? "border-white/[0.06] bg-[#2B2B2B] text-white/80"
          : "border-white/[0.06] bg-[#2B2B2B] text-white/45 hover:text-white/80"
      }`}
    >
      <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
      {count}
    </button>
  );
}
