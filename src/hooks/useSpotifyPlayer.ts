import { useEffect, useState, useCallback } from 'react';

interface UseSpotifyPlayerProps {
  token: string;
  name: string;
}

interface PlayerState {
  isReady: boolean;
  isActive: boolean;
  isPaused: boolean;
  currentTrack: Spotify.WebPlaybackTrack | null;
  deviceId: string | null;
  position: number;
  duration: number;
}

export const useSpotifyPlayer = ({ token, name }: UseSpotifyPlayerProps) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isReady: false,
    isActive: false,
    isPaused: true,
    currentTrack: null,
    deviceId: null,
    position: 0,
    duration: 0,
  });

  useEffect(() => {
    if (!token) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name,
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setPlayerState((prev) => ({
          ...prev,
          isReady: true,
          deviceId: device_id,
        }));
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setPlayerState((prev) => ({
          ...prev,
          isReady: false,
        }));
      });

      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;

        setPlayerState((prev) => ({
          ...prev,
          isActive: true,
          isPaused: state.paused,
          currentTrack: state.track_window.current_track,
          position: state.position,
          duration: state.duration || 0,
        }));
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [token, name]);

  const togglePlay = useCallback(() => {
    if (player) {
      player.togglePlay();
    }
  }, [player]);

  const skipToNext = useCallback(() => {
    if (player) {
      player.nextTrack();
    }
  }, [player]);

  const skipToPrevious = useCallback(() => {
    if (player) {
      player.previousTrack();
    }
  }, [player]);

  const seek = useCallback(
    (position: number) => {
      if (player) {
        player.seek(position);
      }
    },
    [player]
  );

  const setVolume = useCallback(
    (volume: number) => {
      if (player) {
        player.setVolume(volume);
      }
    },
    [player]
  );

  return {
    player,
    playerState,
    togglePlay,
    skipToNext,
    skipToPrevious,
    seek,
    setVolume,
  };
};
