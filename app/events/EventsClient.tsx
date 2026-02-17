"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { Event, EventCategory, MusicGenre } from "@/data/types";
import {
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaTimes,
  FaTag,
  FaCheck,
} from "react-icons/fa";

interface Props {
  events: Event[];
  locale?: "pt" | "en";
}

const isFree = (price?: string) => {
  if (!price) return false;
  const p = price.toLowerCase();
  return p.includes("free") || p === "0€" || p === "0 €" || p === "0.00€";
};

// Categorize events by type (title + description)
const getCategoryForEvent = (
  title: string,
  description: string,
  location: string,
): EventCategory => {
  const text = `${title} ${description} ${location}`.toLowerCase();

  // Discoteca/Nightlife (check first - most specific)
  if (
    text.includes("discoteca") ||
    text.includes("nightclub") ||
    text.includes("boate") ||
    text.includes("cocktail") ||
    (text.includes("dj") && text.includes("danca")) ||
    text.includes("dance") ||
    text.includes("cabaret") ||
    text.includes("burlesque") ||
    text.includes("stand-up") ||
    text.includes("comedy") ||
    text.includes("vida nocturna") ||
    text.includes("noite louca") ||
    (text.includes("barcos") && text.includes("festa"))
  )
    return "Discoteca/Nightlife";

  // Teatro
  if (
    text.includes("teatro") ||
    text.includes("peça") ||
    text.includes("espetáculo") ||
    text.includes("dramático")
  )
    return "Teatro";

  // Cinema
  if (
    text.includes("cinema") ||
    text.includes("filme") ||
    text.includes("documentário") ||
    text.includes("projeção")
  )
    return "Cinema";

  // Música
  if (
    text.includes("concerto") ||
    text.includes("música") ||
    text.includes("show") ||
    text.includes("festival") ||
    text.includes("banda") ||
    text.includes("artista") ||
    text.includes("fado") ||
    text.includes("rock") ||
    text.includes("jazz") ||
    text.includes("músicos") ||
    text.includes("músical")
  )
    return "Música";

  // Dança
  if (
    text.includes("dança") ||
    text.includes("ballet") ||
    text.includes("coreograf") ||
    text.includes("movimento")
  )
    return "Dança";

  // Exposição
  if (
    text.includes("exposição") ||
    text.includes("mostra") ||
    text.includes("galeria") ||
    text.includes("arte") ||
    text.includes("museu") ||
    text.includes("obra")
  )
    return "Exposição";

  // Conferência
  if (
    text.includes("palestra") ||
    text.includes("seminário") ||
    text.includes("conferência") ||
    text.includes("talk") ||
    text.includes("workshop") ||
    text.includes("formação") ||
    text.includes("entrevista")
  )
    return "Conferência";

  // Mercado/Feira
  if (
    text.includes("mercado") ||
    text.includes("feira") ||
    text.includes("market") ||
    text.includes("feria") ||
    text.includes("vendas")
  )
    return "Mercado/Feira";

  // Festa
  if (
    text.includes("festa") ||
    text.includes("party") ||
    text.includes("carnaval") ||
    text.includes("celebração") ||
    text.includes("noite")
  )
    return "Festa";

  // Ao Ar Livre
  if (
    text.includes("ao ar livre") ||
    text.includes("parque") ||
    text.includes("jardim") ||
    text.includes("lav") ||
    text.includes("outdoor")
  )
    return "Ao Ar Livre";

  return "Outro";
};

// Detect music genre
const getMusicGenre = (
  title: string,
  description: string,
  category: string,
): MusicGenre | null => {
  // Only detect for music category
  if (!category.includes("Música")) return null;

  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("fado")) return "Fado";
  if (text.includes("rock")) return "Rock";
  if (text.includes("jazz")) return "Jazz";
  if (text.includes("pop")) return "Pop";
  if (text.includes("hard techno") || text.includes("hardtechno"))
    return "Hard Techno";
  if (text.includes("techno")) return "Techno";
  if (text.includes("trance")) return "Trance";
  if (text.includes("house")) return "House";
  if (text.includes("funk")) return "Funk";
  if (
    text.includes("clássic") ||
    text.includes("orquest") ||
    text.includes("sinfonia") ||
    text.includes("clásico")
  )
    return "Clássico";
  if (text.includes("reggae")) return "Reggae";
  if (
    text.includes("hip-hop") ||
    text.includes("hiphop") ||
    text.includes("rap")
  )
    return "Hip-Hop";
  if (
    text.includes("folk") ||
    text.includes("tradicion") ||
    text.includes("gaita")
  )
    return "Folk/Tradicional";
  if (
    text.includes("samba") ||
    text.includes("carnaval") ||
    text.includes("bossa nova")
  )
    return "Samba/Carnaval";
  if (text.includes("k-pop") || text.includes("kpop")) return "K-Pop";
  if (text.includes("experimental") || text.includes("avant-garde"))
    return "Experimental";

  return null;
};

export default function EventsClient({ events, locale = "pt" }: Props) {
  const labels = {
    musicGenre: locale === "pt" ? "Género de Música" : "Music Genre",
    upcoming: locale === "pt" ? "Próximos Eventos" : "Upcoming Events",
    filters: locale === "pt" ? "Filtros" : "Filters",
    clearAll: locale === "pt" ? "Limpar tudo" : "Clear all",
    searchPlaceholder: locale === "pt" ? "Pesquisar..." : "Search...",
    clearSearch: locale === "pt" ? "Limpar pesquisa" : "Clear search",
    minDate: locale === "pt" ? "Data mínima" : "Minimum date",
    freeOnly: locale === "pt" ? "Só gratuitos" : "Free only",
    sortLabel: locale === "pt" ? "Ordenar" : "Sort",
    sortAsc: locale === "pt" ? "Mais próximos" : "Soonest",
    sortDesc: locale === "pt" ? "Mais distantes" : "Latest",
    eventType: locale === "pt" ? "Tipo de Evento" : "Event Type",
    noResults:
      locale === "pt"
        ? "Nenhum evento encontrado com os filtros atuais."
        : "No events found for the selected filters.",
    clearFilters:
      locale === "pt" ? "Tentar remover filtros" : "Try clearing filters",
  };

  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [selectedCategories, setSelectedCategories] = useState<
    Set<EventCategory>
  >(new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<MusicGenre>>(
    new Set(),
  );

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set<EventCategory>();
    events.forEach((e) => {
      const cat =
        e.category || getCategoryForEvent(e.title, e.description, e.location);
      cats.add(cat);
    });
    return Array.from(cats).sort();
  }, [events]);

  // Get unique music genres (only for music category)
  const uniqueGenres = useMemo(() => {
    const genres = new Set<MusicGenre>();
    events.forEach((e) => {
      const cat =
        e.category || getCategoryForEvent(e.title, e.description, e.location);
      if (cat === "Música") {
        const genre =
          e.musicGenre || getMusicGenre(e.title, e.description, cat);
        if (genre) genres.add(genre);
      }
    });
    return Array.from(genres).sort();
  }, [events]);

  const toggleCategory = (category: EventCategory) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const toggleGenre = (genre: MusicGenre) => {
    const newGenres = new Set(selectedGenres);
    if (newGenres.has(genre)) {
      newGenres.delete(genre);
    } else {
      newGenres.add(genre);
    }
    setSelectedGenres(newGenres);
  };

  const hasActiveFilters =
    query ||
    startDate ||
    onlyFree ||
    selectedCategories.size > 0 ||
    selectedGenres.size > 0;

  const clearAllFilters = () => {
    setQuery("");
    setStartDate("");
    setOnlyFree(false);
    setSelectedCategories(new Set());
    setSelectedGenres(new Set());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => {
        if (onlyFree && !isFree(e.price)) return false;
        if (startDate) {
          const evEndOrStart = e.endDate
            ? new Date(e.endDate)
            : new Date(e.date);
          if (evEndOrStart < new Date(startDate)) return false;
        }
        if (selectedCategories.size > 0) {
          const eventCat =
            e.category ||
            getCategoryForEvent(e.title, e.description, e.location);
          if (!selectedCategories.has(eventCat)) return false;
        }
        if (selectedGenres.size > 0) {
          const eventCat =
            e.category ||
            getCategoryForEvent(e.title, e.description, e.location);
          const eventGenre =
            e.musicGenre || getMusicGenre(e.title, e.description, eventCat);
          if (!eventGenre || !selectedGenres.has(eventGenre)) return false;
        }
        if (q) {
          const haystack =
            `${e.title} ${e.description} ${e.location}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return sort === "asc" ? da - db : db - da;
      });
  }, [
    events,
    query,
    onlyFree,
    startDate,
    sort,
    selectedCategories,
    selectedGenres,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 text-brand-grey uppercase tracking-widest text-xs font-bold">
            <FaFilter /> {labels.filters}
            {hasActiveFilters && (
              <span className="bg-brand-red text-white px-2 py-1 rounded text-xs font-bold">
                {selectedCategories.size +
                  selectedGenres.size +
                  (query ? 1 : 0) +
                  (startDate ? 1 : 0) +
                  (onlyFree ? 1 : 0)}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-brand-grey hover:text-brand-red transition-colors text-xs font-bold flex items-center gap-1"
            >
              <FaTimes /> {labels.clearAll}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Filter */}
          <label className="flex items-center gap-3 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-brand-red lg:col-span-1">
            <span className="sr-only">{labels.searchPlaceholder}</span>
            <FaSearch className="text-brand-grey flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
              className="flex-1 bg-transparent text-white outline-none text-sm"
            />
            {query && (
              <button
                className="text-brand-grey hover:text-white flex-shrink-0"
                onClick={() => setQuery("")}
                aria-label={labels.clearSearch}
              >
                <FaTimes size={16} />
              </button>
            )}
          </label>

          {/* Date Filter */}
          <label className="flex flex-col text-sm text-brand-grey gap-2 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 lg:col-span-1">
            <span className="text-xs font-bold">{labels.minDate}</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-b border-brand-grey-dark/50 px-0 py-1 text-white focus:outline-none focus:border-brand-red"
            />
          </label>

          {/* Free Events Filter */}
          <label className="flex items-center gap-3 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 text-sm text-white lg:col-span-1 cursor-pointer hover:border-brand-red transition-colors">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="accent-brand-red w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">{labels.freeOnly}</span>
          </label>

          {/* Sort Filter */}
          <label className="flex flex-col text-sm text-brand-grey gap-2 bg-brand-black border border-brand-grey-dark rounded-xl px-4 py-3 lg:col-span-1">
            <span className="text-xs font-bold">{labels.sortLabel}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "asc" | "desc")}
              className="bg-transparent border-b border-brand-grey-dark/50 px-0 py-1 text-white focus:outline-none focus:border-brand-red"
            >
              <option value="asc">{labels.sortAsc}</option>
              <option value="desc">{labels.sortDesc}</option>
            </select>
          </label>
        </div>

        {/* Category Filter - Multi-select */}
        {uniqueCategories.length > 1 && (
          <div className="mt-6 pt-6 border-t border-brand-grey-dark/30 animate-fade-in-up">
            <p className="text-xs text-brand-grey font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaTag size={12} className="text-brand-red" />
              <span className="bg-gradient-to-r from-brand-grey to-white bg-clip-text text-transparent">
                {labels.eventType}
              </span>
              <span className="bg-brand-grey-dark/50 text-brand-grey-light px-1.5 py-0.5 rounded-full text-[10px]">
                {selectedCategories.size}
              </span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  aria-pressed={selectedCategories.has(category)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${
                    selectedCategories.has(category)
                      ? "bg-gradient-to-br from-brand-red via-red-600 to-brand-red-light text-white border border-red-500/50 shadow-[0_0_15px_-3px_rgba(220,38,38,0.5)] transform scale-105"
                      : "bg-brand-black-light border border-brand-grey-dark/60 text-brand-grey hover:border-brand-red/70 hover:text-white hover:shadow-[0_0_12px_-5px_rgba(220,38,38,0.3)] hover:-translate-y-0.5"
                  }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    {selectedCategories.has(category) && (
                      <FaCheck size={10} className="animate-scale-in" />
                    )}
                    {category}
                  </span>
                  {/* Hover shine effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Music Genre Filter - Multi-select (only show when Música is selected or available) */}
        {(selectedCategories.has("Música") || uniqueGenres.length > 0) &&
          uniqueGenres.length > 0 && (
            <div className="mt-6 pt-6 border-t border-brand-grey-dark/30 animate-fade-in-up delay-100">
              <p className="text-xs text-brand-grey font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-brand-red text-lg">🎵</span>
                <span className="bg-gradient-to-r from-brand-grey to-white bg-clip-text text-transparent">
                  {labels.musicGenre}
                </span>
                <span className="bg-brand-grey-dark/50 text-brand-grey-light px-1.5 py-0.5 rounded-full text-[10px]">
                  {selectedGenres.size}
                </span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {uniqueGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    aria-pressed={selectedGenres.has(genre)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${
                      selectedGenres.has(genre)
                        ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border border-purple-500/50 shadow-[0_0_15px_-3px_rgba(147,51,234,0.5)] transform scale-105"
                        : "bg-brand-black-light border border-brand-grey-dark/60 text-brand-grey hover:border-indigo-500/70 hover:text-white hover:shadow-[0_0_12px_-5px_rgba(99,102,241,0.3)] hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1.5">
                      {selectedGenres.has(genre) && (
                        <FaCheck size={10} className="animate-scale-in" />
                      )}
                      {genre}
                    </span>
                    {/* Hover shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 uppercase tracking-widest text-sm font-bold text-brand-red">
          <FaCalendarAlt /> {labels.upcoming}
          <span className="text-white text-base">
            {filtered.length} / {events.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((event) => (
          <div key={event.id} className="h-full">
            <Link
              href={`/${locale}/events/${event.id}`}
              className="block h-full hover:scale-[1.02] transition-transform"
            >
              <EventCard event={event} locale={locale} />
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-brand-grey text-lg mb-4">{labels.noResults}</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-brand-red hover:text-white font-bold transition-colors"
            >
              {labels.clearFilters}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
