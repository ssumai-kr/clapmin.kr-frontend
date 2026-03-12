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
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <Music2 className="h-5 w-5" />
        Now Playing
      </h2>
      <YouTubePlayer videoIds={youtubeVideoIds} />
    </div>
  );
}
