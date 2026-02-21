"use client";

import { useAudio } from "../context/AudioContext";
import { FaPlay, FaPause, FaTimes } from "react-icons/fa";
import { useTranslations } from "@/lib/use-translations";

interface StickyPlayerProps {
  locale?: "pt" | "en";
}

export default function StickyPlayer({ locale = "pt" }: StickyPlayerProps) {
  const t = useTranslations(locale);
  const {
    isPlaying,
    currentEpisode,
    togglePlay,
    closePlayer,
    currentTime,
    duration,
    seek,
  } = useAudio();

  if (!currentEpisode) return null;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-brand-grey-dark border-t border-brand-red/20 shadow-2xl p-4 z-50 animate-slide-up">
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Helper info / close */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={closePlayer}
            className="text-brand-grey hover:text-white p-2"
            aria-label={t("player.close", "Close player")}
          >
            <FaTimes />
          </button>

          <div className="truncate">
            <h4 className="font-bold text-white text-sm truncate">
              {currentEpisode.title}
            </h4>
            <p className="text-brand-grey text-xs truncate">
              {currentEpisode.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-6 mb-2">
            <button
              className="text-brand-grey hover:text-white transition-colors"
              title={t("player.rewind_15", "Rewind 15s")}
              aria-label={t("player.rewind_15_seconds", "Rewind 15 seconds")}
              onClick={() => seek(currentTime - 15)}
            >
              <span className="text-xs font-bold">-15s</span>
            </button>

            <button
              onClick={togglePlay}
              className="bg-brand-white text-brand-black hover:bg-brand-red hover:text-white p-3 rounded-full transition-all transform hover:scale-105"
              aria-label={
                isPlaying
                  ? t("player.pause_playback", "Pause playback")
                  : t("player.play_playback", "Play playback")
              }
            >
              {isPlaying ? <FaPause /> : <FaPlay className="pl-0.5" />}
            </button>

            <button
              className="text-brand-grey hover:text-white transition-colors"
              title={t("player.forward_15", "Forward 15s")}
              aria-label={t("player.forward_15_seconds", "Forward 15 seconds")}
              onClick={() => seek(currentTime + 15)}
            >
              <span className="text-xs font-bold">+15s</span>
            </button>
          </div>

          <div className="w-full flex items-center gap-3 text-xs text-brand-grey font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              aria-label={t("player.seek_timeline", "Seek audio timeline")}
              className="flex-1 h-1 bg-brand-grey/30 rounded-lg appearance-none cursor-pointer accent-brand-red"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Extra space for volume or download later */}
        <div className="flex-1 hidden md:flex justify-end">
          {/* Placeholder for volume control */}
        </div>
      </div>
    </div>
  );
}
