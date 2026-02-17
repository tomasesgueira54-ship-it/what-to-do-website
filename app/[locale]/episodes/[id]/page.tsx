"use client";

import AudioPlayer from "@/components/AudioPlayer";
import Link from "next/link";
import {
  FaArrowLeft,
  FaClock,
  FaListUl,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";
import { richEpisodesMap } from "@/data/episodes";
import { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import { useParams } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

export default function EpisodePage() {
  const params = useParams<{ locale?: string; id?: string }>();
  const localeParam = params?.locale ?? defaultLocale;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const id = params?.id ?? "";
  const isPt = locale === "pt";
  const episode = richEpisodesMap[id];
  const [activeTab, setActiveTab] = useState<"shownotes" | "transcript">(
    "shownotes",
  );
  const { seek, playEpisode, currentEpisode, isPlaying } = useAudio();

  if (!episode) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="text-brand-grey mb-4">
            {isPt ? "Episódio não encontrado." : "Episode not found."}
          </p>
          <Link href={`/${locale}/episodes`} className="btn-secondary">
            {isPt ? "Voltar aos episódios" : "Back to episodes"}
          </Link>
        </div>
      </section>
    );
  }

  const handleJumpToTime = (seconds: number) => {
    if (currentEpisode?.id !== episode.id) {
      playEpisode(episode);
      setTimeout(() => seek(seconds), 100);
    } else {
      seek(seconds);
      if (!isPlaying) playEpisode(episode);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          href={`/${locale}/episodes`}
          className="inline-flex items-center text-brand-grey hover:text-brand-red mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          {isPt ? "Voltar aos episódios" : "Back to episodes"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {isPt ? `Episódio #${episode.id}` : `Episode #${episode.id}`}
                </span>
                <span className="text-brand-grey text-sm flex items-center gap-1">
                  <FaClock className="text-brand-red" /> {episode.duration}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {episode.title}
              </h1>
              <p className="text-xl text-brand-grey leading-relaxed">
                {episode.description}
              </p>
            </header>

            <div className="mb-12">
              <AudioPlayer episode={episode} />
            </div>

            <div className="flex border-b border-brand-grey/20 mb-8 space-x-8">
              <button
                onClick={() => setActiveTab("shownotes")}
                className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                  activeTab === "shownotes"
                    ? "text-brand-red border-b-2 border-brand-red"
                    : "text-brand-grey hover:text-white"
                }`}
              >
                <FaListUl />
                {isPt ? "Show Notes" : "Show Notes"}
              </button>

              <button
                onClick={() => setActiveTab("transcript")}
                className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                  activeTab === "transcript"
                    ? "text-brand-red border-b-2 border-brand-red"
                    : "text-brand-grey hover:text-white"
                }`}
              >
                <FaFileAlt />
                {isPt ? "Transcrição" : "Transcript"}
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "shownotes" && (
                <div className="animate-fade-in space-y-8">
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {isPt ? "Neste episódio:" : "In this episode:"}
                    </h3>

                    <div className="space-y-4">
                      {episode.showNotes?.map((note, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 group hover:bg-brand-grey-dark/20 p-2 rounded transition-colors -ml-2"
                        >
                          <button
                            onClick={() => handleJumpToTime(note.seconds)}
                            className="flex-shrink-0 bg-brand-grey-dark text-brand-red hover:bg-brand-red hover:text-white text-xs font-mono py-1 px-2 rounded transition-colors mt-0.5 w-16 text-center"
                          >
                            {note.time}
                          </button>
                          <span className="text-brand-grey group-hover:text-brand-white transition-colors">
                            {note.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "transcript" && (
                <div className="animate-fade-in space-y-6">
                  <div className="bg-brand-grey-dark/30 p-6 rounded-lg border border-brand-grey/10">
                    <p className="text-sm text-brand-grey italic mb-8 border-b border-brand-grey/10 pb-4">
                      {isPt
                        ? "Nota: Esta transcrição é gerada automaticamente e pode conter erros."
                        : "Note: This transcript is automatically generated and may contain errors."}
                    </p>

                    <div className="space-y-6">
                      {episode.transcript?.map((segment, index) => (
                        <div
                          key={index}
                          className="flex gap-6 group hover:bg-brand-grey-dark/20 p-3 rounded transition-colors -mx-3"
                        >
                          <div className="flex-shrink-0 w-12 pt-1">
                            <button
                              onClick={() => handleJumpToTime(segment.seconds)}
                              className="text-xs font-mono text-brand-grey opacity-50 group-hover:opacity-100 hover:text-brand-red transition-all"
                            >
                              {segment.time}
                            </button>
                          </div>
                          <div className="flex-1">
                            <span className="block text-xs font-bold text-brand-red mb-1 uppercase tracking-wider">
                              {segment.speaker}
                            </span>
                            <p className="text-brand-white/90 leading-relaxed">
                              {segment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {episode.guest && (
              <div className="bg-brand-grey-dark rounded-xl p-6 border border-brand-grey/20">
                <h3 className="flex items-center gap-2 font-bold text-white mb-4 uppercase tracking-wider text-sm">
                  <FaUser className="text-brand-red" />
                  {isPt ? "Convidado" : "Guest"}
                </h3>

                <div>
                  <h4 className="font-display text-xl font-bold text-brand-white mb-2">
                    {episode.guest.name}
                  </h4>
                  <p className="text-sm text-brand-grey leading-relaxed mb-4">
                    {episode.guest.bio}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {episode.guest.links?.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs border border-brand-grey/30 rounded-full px-3 py-1 text-brand-grey hover:border-brand-red hover:text-brand-red transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
