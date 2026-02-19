"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";

export interface IEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl?: string;
  duration?: string;
}

interface AudioContextType {
  isPlaying: boolean;
  currentEpisode: IEpisode | null;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  playEpisode: (episode: IEpisode) => void;
  seek: (time: number) => void;
  closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

function hasPlayableAudioSource(source?: string) {
  if (!source) return false;
  return /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(source);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<IEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle play/pause logic when dependencies change
  useEffect(() => {
    const audio = audioRef.current;
    if (
      !audio ||
      !currentEpisode ||
      !hasPlayableAudioSource(currentEpisode.audioUrl)
    )
      return;

    // If source changed, update it
    // Store current src to compare? Alternatively compare episode IDs
    // But HTMLAudioElement.src is absolute path, let's just coordinate carefully.

    // We handle source setting in playEpisode

    if (isPlaying) {
      audio.play().catch((e) => {
        console.warn("Playback unavailable for current source");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentEpisode]);

  const playEpisode = (episode: IEpisode) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!hasPlayableAudioSource(episode.audioUrl)) {
      setCurrentEpisode(episode);
      setIsPlaying(false);
      return;
    }

    // If it's a new episode
    if (currentEpisode?.id !== episode.id) {
      audio.src = episode.audioUrl;
      setCurrentEpisode(episode);
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      // Same episode, just toggle play if it was paused
      if (!isPlaying) setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentEpisode) return;
    setIsPlaying((prev) => !prev);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const closePlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentEpisode(null);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentEpisode,
        currentTime,
        duration,
        togglePlay,
        playEpisode,
        seek,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
