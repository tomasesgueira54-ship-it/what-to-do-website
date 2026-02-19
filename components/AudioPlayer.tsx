"use client";

import { useAudio, IEpisode } from "@/context/AudioContext";
import { FaPlay, FaPause } from "react-icons/fa";

interface AudioPlayerProps {
  episodeTitle?: string; // Backward compatibility
  audioUrl?: string; // Backward compatibility
  episode?: IEpisode; // New way
}

export default function AudioPlayer({
  episodeTitle,
  audioUrl,
  episode,
}: AudioPlayerProps) {
  const {
    isPlaying,
    currentEpisode,
    playEpisode,
    togglePlay,
    currentTime,
    duration,
    seek,
  } = useAudio();

  // Construct episode object if legacy props are used
  const activeEpisode: IEpisode = episode || {
    id: audioUrl || "unknown",
    title: episodeTitle || "Unknown Episode",
    description: "",
    audioUrl: audioUrl || "",
  };

  const isCurrent = currentEpisode?.id === activeEpisode.id;
  const isActuallyPlaying = isCurrent && isPlaying;
  const hasPlayableAudio = /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(
    activeEpisode.audioUrl,
  );

  const handlePlayPause = () => {
    if (!hasPlayableAudio) return;
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(activeEpisode);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCurrent) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    seek(percent * duration);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Display state
  const displayTime = isCurrent ? currentTime : 0;
  const displayDuration = isCurrent ? duration : 0;

  return (
    <div className="bg-brand-grey-dark rounded-lg p-6 shadow-xl border border-brand-red/20">
      <h3 className="font-semibold text-lg mb-4 text-brand-white">
        {activeEpisode.title}
      </h3>
      {activeEpisode.description && (
        <p className="text-brand-grey text-sm mb-4 leading-relaxed">
          {activeEpisode.description}
        </p>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handlePlayPause}
          disabled={!hasPlayableAudio}
          className={`text-white p-4 rounded-full transition-all ${
            hasPlayableAudio
              ? "bg-brand-red hover:bg-brand-red-light"
              : "bg-brand-grey cursor-not-allowed"
          }`}
          aria-label={isActuallyPlaying ? "Pause episode" : "Play episode"}
        >
          {isActuallyPlaying ? (
            <FaPause className="text-xl" />
          ) : (
            <FaPlay className="text-xl ml-1" />
          )}
        </button>

        <div className="flex-1">
          <div
            className={`h-2 rounded-full relative ${isCurrent ? "cursor-pointer bg-brand-grey" : "bg-brand-grey/30"}`}
            onClick={isCurrent ? handleProgressClick : undefined}
          >
            <div
              className={`bg-brand-red h-full rounded-full transition-all duration-100`}
              style={{
                width: `${displayDuration ? (displayTime / displayDuration) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-sm text-brand-grey mt-1">
            <span>{formatTime(displayTime)}</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>
      </div>
      {!hasPlayableAudio && (
        <p className="text-xs text-brand-grey mt-3">
          Sem fonte de áudio suportada para este episódio.
        </p>
      )}
    </div>
  );
}
