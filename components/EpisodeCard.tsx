"use client";

import Link from "next/link";
import Image from "next/image";
import { FaPlay, FaPause, FaClock } from "react-icons/fa";
import { useAudio } from "@/context/AudioContext";

interface EpisodeCardProps {
  locale?: "pt" | "en";
  episode: {
    id: string;
    title: string;
    description: string;
    duration?: string;
    publishDate: string;
    imageUrl?: string;
    audioUrl?: string; // Optional for listing, but good if we want to play directly
  };
}

export default function EpisodeCard({
  episode,
  locale = "pt",
}: EpisodeCardProps) {
  const { playEpisode, currentEpisode, isPlaying, togglePlay } = useAudio();
  const labels = {
    nowPlaying: locale === "pt" ? "A TOCAR AGORA..." : "PLAYING NOW...",
    paused: locale === "pt" ? "PAUSADO" : "PAUSED",
    minutesFallback: locale === "pt" ? "?? min" : "?? min",
  };

  // We need an audioUrl to play. If it's missing in props (like in a list view),
  // we might need to fetch it or just navigate to the page.
  // For now let's assume we can play if audioUrl exists, otherwise just link.

  // Mocking audioUrl if not present for the card pattern to work with play button
  const episodeWithAudio = {
    ...episode,
    audioUrl: episode.audioUrl || `/audio/episode-${episode.id}.mp3`, // Fallback convention
  };

  const isCurrent = currentEpisode?.id === episode.id;
  const isActuallyPlaying = isCurrent && isPlaying;
  const imageSrc = episode.imageUrl?.startsWith("/images/")
    ? "/images/placeholder-card.svg"
    : episode.imageUrl;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episodeWithAudio);
    }
  };

  return (
    <div className="card group cursor-pointer relative">
      <Link href={`/${locale}/episodes/${episode.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={episode.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-all" />
          <div className="gradient-overlay" />
          <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-sm z-10">
            <FaClock className="text-brand-red" />
            <span>{episode.duration || labels.minutesFallback}</span>
          </div>
        </div>

        <div className="p-6">
          {isCurrent && (
            <div className="mb-2">
              <span className="text-xs font-bold text-brand-red animate-pulse">
                {isActuallyPlaying ? labels.nowPlaying : labels.paused}
              </span>
            </div>
          )}
          <p className="text-brand-grey text-sm mb-2">{episode.publishDate}</p>
          <h3 className="font-display text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">
            {episode.title}
          </h3>
          <p className="text-brand-grey line-clamp-2">{episode.description}</p>
        </div>
      </Link>

      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <button
          onClick={handlePlay}
          aria-label={
            isActuallyPlaying
              ? locale === "pt"
                ? "Pausar episódio"
                : "Pause episode"
              : locale === "pt"
                ? "Reproduzir episódio"
                : "Play episode"
          }
          className={`pointer-events-auto bg-brand-red rounded-full p-4 transition-all duration-300 transform hover:scale-110 hover:bg-brand-red-light focus:outline-none ${isActuallyPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"}`}
        >
          {isActuallyPlaying ? (
            <FaPause className="text-2xl text-white" />
          ) : (
            <FaPlay className="text-2xl text-white ml-1" />
          )}
        </button>
      </div>
    </div>
  );
}
