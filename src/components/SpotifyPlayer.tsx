import { useState, useEffect } from 'react';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';

interface SpotifyPlayerProps {
  token: string;
}

export default function SpotifyPlayer({ token }: SpotifyPlayerProps) {
  const [volume] = useState(50);
  const playlistUri = import.meta.env.VITE_SPOTIFY_PLAYLIST_URI || '';

  const {
    playerState,
    togglePlay,
    skipToNext,
    skipToPrevious,
    setVolume: setPlayerVolume,
  } = useSpotifyPlayer({
    token,
    name: 'Clapmin Web Player',
  });

  useEffect(() => {
    setPlayerVolume(volume / 100);
  }, [volume, setPlayerVolume]);

  const playPlaylist = async () => {
    if (!playerState.deviceId || !playlistUri) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playerState.deviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          context_uri: playlistUri,
        }),
      });

      if (!response.ok) {
        console.error('Failed to play playlist:', await response.text());
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!playerState.isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Spotify Player 연결 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {playerState.currentTrack ? (
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={playerState.currentTrack.album.images[0]?.url}
              alt={playerState.currentTrack.album.name}
              className="w-16 h-16 rounded-lg shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold truncate">
                {playerState.currentTrack.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {playerState.currentTrack.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
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
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="이전 트랙"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-lg"
              aria-label={playerState.isPaused ? '재생' : '일시정지'}
            >
              {playerState.isPaused ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>

            <button
              onClick={skipToNext}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="다음 트랙"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 text-center border">
          <div className="animate-pulse space-y-2">
            <div className="w-12 h-12 bg-secondary rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground">플레이리스트 로딩 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}
