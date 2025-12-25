import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    // YouTube IFrame API 로드
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: videoId,
          },
          events: {
            onReady: (event: any) => {
              setPlayer(event.target);
              setDuration(event.target.getDuration());
              setVideoTitle(event.target.getVideoData().title);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
                setIsPlaying(false);
              } else {
                setIsPlaying(false);
              }
            },
          },
        });
      }
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* 숨겨진 YouTube 플레이어 */}
      <div className="hidden">
        <div ref={playerRef} />
      </div>

      {/* 커스텀 UI */}
      <div className="bg-card/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border">
        {/* 썸네일 */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* 재생 버튼 오버레이 */}
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label={isPlaying ? '일시정지' : '재생'}
          >
            <div className="bg-red-600/90 backdrop-blur-sm p-4 rounded-full group-hover:bg-red-600 transition-all transform group-hover:scale-110">
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          </button>

          {/* 타이틀 */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-semibold text-sm drop-shadow-lg line-clamp-2">
              {videoTitle || 'Loading...'}
            </p>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="px-4 pt-3 pb-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
            <div
              className="bg-red-600 h-1 rounded-full transition-all"
              style={{
                width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
