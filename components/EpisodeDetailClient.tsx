"use client";

import AudioPlayer from "@/components/AudioPlayer";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowLeft,
  FaClock,
  FaListUl,
  FaFileAlt,
  FaUser,
} from "react-icons/fa";
import { useState } from "react";
import { useAudio } from "@/context/AudioContext";
import type { IRichEpisode } from "@/data/episodes";

interface EpisodeDetailClientProps {
  episode: IRichEpisode;
  locale: string;
}

export default function EpisodeDetailClient({
  episode,
  locale,
}: EpisodeDetailClientProps) {
  const isPt = locale === "pt";
  const hasPlayableAudio = /\.(mp3|wav|ogg|m4a|aac|webm)(\?.*)?$/i.test(
    episode.audioUrl || "",
  );
  const [activeTab, setActiveTab] = useState<
    "shownotes" | "transcript" | "flashcards" | "article" | "mindmap"
  >("shownotes");
  const { seek, playEpisode, currentEpisode, isPlaying } = useAudio();
  const hasShowNotes =
    Array.isArray(episode.showNotes) && episode.showNotes.length > 0;
  const hasTranscript =
    Array.isArray(episode.transcript) && episode.transcript.length > 0;
  const hasFlashcards =
    Array.isArray(episode.flashcards) && episode.flashcards.length > 0;
  const hasArticle = !!episode.longDescription;
  const hasMindMap = !!episode.comparisonTable || !!episode.mindMapUrl;
  const hasSupplementalContent =
    hasShowNotes || hasTranscript || hasFlashcards || hasArticle || hasMindMap;

  // video disabled
  const embedUrl = "";

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
        <nav className="flex items-center gap-2 text-sm text-brand-grey mb-8 flex-wrap">
          <Link
            href={`/${locale}`}
            className="hover:text-brand-red transition-colors"
          >
            {isPt ? "Início" : "Home"}
          </Link>
          <span className="text-brand-grey-dark">/</span>
          <Link
            href={`/${locale}/episodes`}
            className="hover:text-brand-red transition-colors"
          >
            {isPt ? "Episódios" : "Episodes"}
          </Link>
          <span className="text-brand-grey-dark">/</span>
          <span className="text-white truncate max-w-[200px]">
            {episode.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {isPt ? "Episódio" : "Episode"}
                </span>
                {episode.duration && (
                  <span className="text-brand-grey text-sm flex items-center gap-1">
                    <FaClock className="text-brand-red" /> {episode.duration}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {episode.title}
              </h1>
              <p className="text-xl text-brand-grey leading-relaxed">
                {episode.description}
              </p>
            </header>

            <div className="mb-12">
              {/* video section disabled */}

              {hasPlayableAudio ? (
                <AudioPlayer episode={episode} />
              ) : (
                <div className="bg-brand-grey-dark/30 border border-brand-grey/20 rounded-xl p-5">
                  <p className="text-brand-grey mb-3">
                    {isPt
                      ? "O áudio deste episódio ainda não está disponível."
                      : "Audio for this episode is not available yet."}
                  </p>
                  <Link
                    href={`/${locale}/podcast/cantinho-dos-segredos`}
                    className="btn-secondary inline-flex"
                  >
                    {isPt
                      ? "Ver episódio especial com vídeo"
                      : "Watch the special video episode"}
                  </Link>
                </div>
              )}
            </div>

            {hasSupplementalContent && (
              <div
                className="flex border-b border-brand-grey/20 mb-8 space-x-8"
                role="tablist"
                aria-label={isPt ? "Conteúdo do episódio" : "Episode content"}
              >
                {hasShowNotes && (
                  <button
                    onClick={() => setActiveTab("shownotes")}
                    role="tab"
                    id="tab-shownotes"
                    aria-controls="panel-shownotes"
                    aria-selected={activeTab === "shownotes"}
                    className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                      activeTab === "shownotes"
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-brand-grey hover:text-white"
                    }`}
                  >
                    <FaListUl />
                    Show Notes
                  </button>
                )}

                {hasTranscript && (
                  <button
                    onClick={() => setActiveTab("transcript")}
                    role="tab"
                    id="tab-transcript"
                    aria-controls="panel-transcript"
                    aria-selected={activeTab === "transcript"}
                    className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                      activeTab === "transcript"
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-brand-grey hover:text-white"
                    }`}
                  >
                    <FaFileAlt />
                    {isPt ? "Transcrição" : "Transcript"}
                  </button>
                )}
                {hasFlashcards && (
                  <button
                    onClick={() => setActiveTab("flashcards")}
                    role="tab"
                    id="tab-flashcards"
                    aria-controls="panel-flashcards"
                    aria-selected={activeTab === "flashcards"}
                    className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                      activeTab === "flashcards"
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-brand-grey hover:text-white"
                    }`}
                  >
                    📚 {isPt ? "Flashcards" : "Flashcards"}
                  </button>
                )}
                {hasArticle && (
                  <button
                    onClick={() => setActiveTab("article")}
                    role="tab"
                    id="tab-article"
                    aria-controls="panel-article"
                    aria-selected={activeTab === "article"}
                    className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                      activeTab === "article"
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-brand-grey hover:text-white"
                    }`}
                  >
                    📝 {isPt ? "Artigo" : "Article"}
                  </button>
                )}
                {hasMindMap && (
                  <button
                    onClick={() => setActiveTab("mindmap")}
                    role="tab"
                    id="tab-mindmap"
                    aria-controls="panel-mindmap"
                    aria-selected={activeTab === "mindmap"}
                    className={`pb-4 px-2 font-semibold text-lg flex items-center gap-2 transition-colors relative ${
                      activeTab === "mindmap"
                        ? "text-brand-red border-b-2 border-brand-red"
                        : "text-brand-grey hover:text-white"
                    }`}
                  >
                    🧠 {isPt ? "Mind Map" : "Mind Map"}
                  </button>
                )}
              </div>
            )}

            {hasSupplementalContent && (
              <div className="min-h-[400px]">
                {activeTab === "shownotes" && hasShowNotes && (
                  <div
                    className="animate-fade-in space-y-8"
                    role="tabpanel"
                    id="panel-shownotes"
                    aria-labelledby="tab-shownotes"
                  >
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

                {activeTab === "transcript" && hasTranscript && (
                  <div
                    className="animate-fade-in space-y-6"
                    role="tabpanel"
                    id="panel-transcript"
                    aria-labelledby="tab-transcript"
                  >
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
                                onClick={() =>
                                  handleJumpToTime(segment.seconds)
                                }
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

                {activeTab === "flashcards" && hasFlashcards && (
                  <div
                    className="animate-fade-in space-y-6"
                    role="tabpanel"
                    id="panel-flashcards"
                    aria-labelledby="tab-flashcards"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {episode.flashcards!.map((card, idx) => (
                        <div
                          key={idx}
                          className="bg-brand-grey-dark/30 p-4 rounded-lg border border-brand-grey/20"
                        >
                          <p className="font-semibold text-white mb-2">
                            {card.question}
                          </p>
                          <p className="text-brand-grey-light">{card.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "article" && hasArticle && (
                  <div
                    className="animate-fade-in space-y-6 prose prose-invert max-w-none"
                    role="tabpanel"
                    id="panel-article"
                    aria-labelledby="tab-article"
                  >
                    {episode
                      .longDescription!.split("\n\n")
                      .map((block, idx) => {
                        if (block.trim().startsWith("##")) {
                          return (
                            <h3
                              key={idx}
                              className="text-2xl font-bold text-white mt-8 mb-4"
                            >
                              {block.replace(/^##\s*/, "")}
                            </h3>
                          );
                        }
                        return (
                          <p
                            key={idx}
                            className="text-brand-grey-light leading-relaxed mb-4"
                          >
                            {block}
                          </p>
                        );
                      })}
                  </div>
                )}

                {activeTab === "mindmap" && hasMindMap && (
                  <div
                    className="space-y-8 animate-fade-in"
                    role="tabpanel"
                    id="panel-mindmap"
                    aria-labelledby="tab-mindmap"
                  >
                    {episode.mindMapUrl && (
                      <div className="bg-white/5 p-4 rounded-xl border border-brand-grey/20 backdrop-blur-sm mb-8">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
                          Mind Map Visual
                        </h3>
                        <div className="relative w-full aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5">
                          <Image
                            src={episode.mindMapUrl}
                            alt="Mind Map"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {episode.comparisonTable && (
                      <div>
                        <h3 className="text-white font-bold mb-4 text-lg">
                          Guia Prático
                        </h3>
                        <div className="overflow-hidden rounded-xl border border-brand-grey/20 bg-brand-grey-dark/30 shadow-xl">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-brand-red/90 text-white">
                                <tr>
                                  {episode.comparisonTable.headers.map(
                                    (h, i) => (
                                      <th
                                        key={i}
                                        className="px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                                      >
                                        {h}
                                      </th>
                                    ),
                                  )}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-brand-grey/10">
                                {episode.comparisonTable.rows.map((row, i) => (
                                  <tr
                                    key={i}
                                    className="hover:bg-brand-grey-dark/50 transition-colors"
                                  >
                                    {row.map((cell, j) => (
                                      <td
                                        key={j}
                                        className="px-6 py-4 text-sm text-brand-grey-light border-r border-brand-grey/5 last:border-0"
                                      >
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
