import { useState, useEffect } from "react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

interface SpotifyPlayerProps {
  token: string;
}

export default function SpotifyPlayer({ token }: SpotifyPlayerProps) {
  const [volume] = useState(50);
  const playlistUri = import.meta.env.VITE_SPOTIFY_PLAYLIST_URI || "";

  const {
    playerState,
    togglePlay,
    skipToNext,
    skipToPrevious,
    setVolume: setPlayerVolume,
  } = useSpotifyPlayer({
    token,
    name: "Clapmin Web Player",
  });

  useEffect(() => {
    setPlayerVolume(volume / 100);
  }, [volume, setPlayerVolume]);

  const playPlaylist = async () => {
    if (!playerState.deviceId || !playlistUri) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${playerState.deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            context_uri: playlistUri,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to play playlist:", await response.text());
      }
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  };

  useEffect(() => {
    if (playerState.isReady && playerState.deviceId && playlistUri) {
      const timer = setTimeout(() => {
        playPlaylist();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerState.isReady, playerState.deviceId]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!playerState.isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Connecting Spotify Player...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {playerState.currentTrack ? (
        <div className="space-y-4 rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <img
              src={playerState.currentTrack.album.images[0]?.url}
              alt={playerState.currentTrack.album.name}
              className="h-16 w-16 rounded-lg shadow-md"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold">
                {playerState.currentTrack.name}
              </h3>
              <p className="truncate text-sm text-muted-foreground">
                {playerState.currentTrack.artists
                  .map((artist) => artist.name)
                  .join(", ")}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{
                  width: `${(playerState.position / playerState.duration) * 100}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(playerState.position)}</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={skipToPrevious}
              className="rounded-full p-2 transition-colors hover:bg-secondary/50"
              aria-label="Previous track"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="rounded-full bg-primary p-3 text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
              aria-label={playerState.isPaused ? "Play" : "Pause"}
            >
              {playerState.isPaused ? (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>

            <button
              onClick={skipToNext}
              className="rounded-full p-2 transition-colors hover:bg-secondary/50"
              aria-label="Next track"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card/60 p-8 text-center backdrop-blur-sm">
          <div className="animate-pulse space-y-2">
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary"></div>
            <p className="text-sm text-muted-foreground">Loading playlist...</p>
          </div>
        </div>
      )}
    </div>
  );
}
