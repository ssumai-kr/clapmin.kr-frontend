import { useEffect, useRef, useState } from "react";
import { Pause, Play, SkipForward } from "lucide-react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

/** Same YouTube mix the old MusicSection used. */
const VIDEO_IDS = ["JKCneM3C8R8", "QwByM5-vwlM", "bH6ZvLhUx5o", "P18g4rKns6Q"];

/**
 * Live "Now Playing" widget — a hidden YouTube player driven by the card.
 * Playback starts on the first click so it satisfies the browser autoplay policy.
 */
export default function NowPlaying() {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const skipInitialLoad = useRef(true);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("YouTube Mix");

  useEffect(() => {
    let cancelled = false;

    const create = () => {
      if (cancelled || !hostRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(hostRef.current, {
        height: "0",
        width: "0",
        videoId: VIDEO_IDS[0],
        playerVars: { controls: 0, playsinline: 1, rel: 0 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              const data = playerRef.current?.getVideoData?.();
              if (data?.title) setTitle(data.title);
            } else if (e.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              setIndex((i) => (i + 1) % VIDEO_IDS.length);
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      create();
    } else {
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        create();
      };
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, []);

  // Load the next track when the index changes (skips the initial cued track).
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (skipInitialLoad.current) {
      skipInitialLoad.current = false;
      return;
    }
    p.loadVideoById(VIDEO_IDS[index]);
    setTimeout(() => {
      const data = p.getVideoData?.();
      if (data?.title) setTitle(data.title);
    }, 500);
  }, [index, ready]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  };

  const next = () => setIndex((i) => (i + 1) % VIDEO_IDS.length);

  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.06] bg-[#2B2B2B] p-3.5">
      <div className="flex items-center gap-[7px]">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            playing ? "animate-pulse bg-green-500" : "bg-white/25"
          }`}
        />
        <span className="font-mono text-[9.5px] tracking-[0.14em] text-white/40">NOW PLAYING</span>
      </div>

      <div className="flex items-end justify-between gap-2.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-[13px] font-medium text-white">{title}</span>
          <span className="text-[12px] text-white/45">
            {index + 1} / {VIDEO_IDS.length} · loop
          </span>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <button
            onClick={toggle}
            disabled={!ready}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#171717] transition-colors hover:bg-white/80 disabled:opacity-40"
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="ml-[1px] h-3.5 w-3.5 fill-current" />
            )}
          </button>
          <button
            onClick={next}
            disabled={!ready}
            aria-label="Next track"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] text-white/60 transition-colors hover:text-white disabled:opacity-40"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Hidden YouTube player (the API replaces this node with an iframe). */}
      <div className="hidden">
        <div ref={hostRef} />
      </div>
    </div>
  );
}
