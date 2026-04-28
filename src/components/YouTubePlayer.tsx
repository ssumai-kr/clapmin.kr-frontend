import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoIds: string[];
}

export default function YouTubePlayer({ videoIds }: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoTitle, setVideoTitle] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const currentVideoId = videoIds[currentIndex];

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        new window.YT.Player(playerRef.current, {
          videoId: currentVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: any) => {
              setPlayer(event.target);
              setDuration(event.target.getDuration());
              setVideoTitle(event.target.getVideoData().title);
              event.target.setVolume(100);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                // Auto advance to next track
                if (currentIndex < videoIds.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                } else {
                  setCurrentIndex(0); // Loop back to first if last track
                }
              } else if (event.data === window.YT.PlayerState.PAUSED) {
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
  }, []);

  // Update player on video change
  useEffect(() => {
    if (player && player.loadVideoById) {
      player.loadVideoById(currentVideoId);
      player.playVideo();
      setCurrentTime(0);

      // Slight delay to fetch info for the new video
      setTimeout(() => {
        if (player.getDuration) {
          setDuration(player.getDuration());
        }
        if (player.getVideoData) {
          setVideoTitle(player.getVideoData().title);
        }
      }, 500);
    }
  }, [currentIndex, currentVideoId, player]);

  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      if (player.getCurrentTime) {
        setCurrentTime(player.getCurrentTime());
      }
      if (player.getDuration && duration === 0) {
        const newDuration = player.getDuration();
        if (newDuration > 0) {
          setDuration(newDuration);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player, duration]);

  const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const toggleMute = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!player) return;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!player) return;
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    player.setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      player.unMute();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return; // Prevent drag on button click
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return; // Prevent drag on button touch
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - startX;
    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Switch page if dragged more than 50px
    if (translateX > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (translateX < -50 && currentIndex < videoIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    setTranslateX(0);
  };

  return (
    <div className="relative w-full py-4">
      {/* Hidden YouTube player */}
      <div className="hidden">
        <div ref={playerRef} />
      </div>

      {/* Carousel wrapper - fixed center container */}
      <div className="relative mx-auto max-w-sm overflow-hidden">
        {/* Carousel container */}
        <div
          className="flex gap-4"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging
              ? "none"
              : "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `translateX(calc(-${currentIndex * 100}% - ${
              currentIndex * 16
            }px + ${translateX}px))`,
          }}
        >
          {videoIds.map((videoId, index) => (
            <div
              key={videoId}
              className="w-full max-w-sm flex-shrink-0 transition-all duration-300"
              style={{
                transform: index === currentIndex ? "scale(1)" : "scale(0.85)",
                opacity: index === currentIndex ? 1 : 0.5,
              }}
            >
              <div className="relative overflow-hidden rounded-2xl border bg-card/90 shadow-2xl backdrop-blur-md">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="Video thumbnail"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Show controls only for the currently playing track */}
                  {index === currentIndex && (
                    <>
                      {/* Play button overlay */}
                      <button
                        onClick={(e) => togglePlay(e)}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          togglePlay(e);
                        }}
                        className="group absolute inset-0 flex items-center justify-center"
                        aria-label={isPlaying ? "Pause" : "Play"}
                        style={{
                          WebkitTapHighlightColor: "transparent",
                          touchAction: "manipulation",
                        }}
                      >
                        <div
                          className="transform rounded-full p-4 backdrop-blur-sm transition-all group-hover:scale-110 group-active:scale-95"
                          style={{ backgroundColor: "rgba(30, 215, 96, 0.9)" }}
                        >
                          {isPlaying ? (
                            <svg
                              className="h-8 w-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          ) : (
                            <svg
                              className="h-8 w-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* Volume control */}
                      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 backdrop-blur-sm">
                        <button
                          onClick={(e) => toggleMute(e)}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            toggleMute(e);
                          }}
                          className="text-white transition-colors hover:text-gray-300"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                          style={{ touchAction: "manipulation" }}
                        >
                          {isMuted || volume === 0 ? (
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0z" />
                            </svg>
                          ) : volume < 50 ? (
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M7 9v6h4l5 5V4l-5 5H7z" />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-white/30 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>
                    </>
                  )}

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="line-clamp-2 text-sm font-semibold text-white drop-shadow-lg">
                      {index === currentIndex ? videoTitle || "Loading..." : ""}
                    </p>
                  </div>
                </div>

                {/* Progress bar - shown only for the currently playing track */}
                {index === currentIndex && (
                  <div className="px-4 pb-4 pt-3">
                    <div className="mb-2 h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{
                          width:
                            duration > 0
                              ? `${(currentTime / duration) * 100}%`
                              : "0%",
                          backgroundColor: "#1ED760",
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page indicator */}
      <div className="mt-6 flex justify-center gap-2">
        {videoIds.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8"
                : "w-2 bg-gray-400 hover:bg-gray-600"
            }`}
            style={index === currentIndex ? { backgroundColor: "#1ED760" } : {}}
            aria-label={`Track ${index + 1}`}
          />
        ))}
      </div>

      {/* Browser recommendation */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-600">
          Best experience with Chrome or Safari browser
        </p>
      </div>
    </div>
  );
}
