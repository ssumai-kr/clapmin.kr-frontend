import { Music2 } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";

const youtubeVideoIds = [
  "JKCneM3C8R8",
  "QwByM5-vwlM",
  "bH6ZvLhUx5o",
  "P18g4rKns6Q",
];

export default function MusicSection() {
  return (
    <div className="sticky top-24">
      <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-foreground">
        <Music2 className="h-5 w-5 text-[hsl(var(--brand-3))]" />
        Now Playing
        <span className="relative ml-1 flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[hsl(var(--brand-3))] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--brand-3))]" />
        </span>
      </h2>
      <YouTubePlayer videoIds={youtubeVideoIds} />
    </div>
  );
}
