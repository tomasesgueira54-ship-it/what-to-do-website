"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Event } from "@/data/types";
import { useFavorites } from "@/lib/use-favorites";
import EventCard from "@/components/EventCard";
import { FaHeart, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import { useTranslations } from "@/lib/use-translations";
import FloatingToast from "@/components/FloatingToast";

interface MyAgendaClientProps {
  events: Event[];
  locale?: "pt" | "en";
}

export default function MyAgendaClient({
  events,
  locale = "pt",
}: MyAgendaClientProps) {
  const { favoriteIds, isHydrated, clearFavorites } = useFavorites();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = useTranslations(locale);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const favoriteEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();

    return events
      .filter((event) => favoriteIds.includes(event.id))
      .sort((a, b) => {
        const aStart = new Date(a.date).getTime();
        const bStart = new Date(b.date).getTime();
        const aEnd = a.endDate ? new Date(a.endDate).getTime() : aStart;
        const bEnd = b.endDate ? new Date(b.endDate).getTime() : bStart;

        const aIsUpcoming = aEnd >= todayMs;
        const bIsUpcoming = bEnd >= todayMs;

        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;

        if (aIsUpcoming && bIsUpcoming) {
          return aStart - bStart;
        }

        return bEnd - aEnd;
      });
  }, [events, favoriteIds]);

  if (!isHydrated) {
    return (
      <div className="py-16 text-center text-brand-grey">
        {t("my_agenda.loading", "Loading favorites...")}
      </div>
    );
  }

  if (favoriteEvents.length === 0) {
    return (
      <>
        <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red mx-auto mb-5 flex items-center justify-center">
            <FaHeart size={24} />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            {t("my_agenda.empty_title", "No favorites yet")}
          </h2>
          <p className="text-brand-grey mb-6 max-w-xl mx-auto">
            {t(
              "my_agenda.empty_description",
              "Save events with the heart icon to build your personal agenda.",
            )}
          </p>
          <Link
            href={`/${locale}/events`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaCalendarAlt size={14} />
            {t("my_agenda.explore_events", "Explore events")}
          </Link>
        </div>

        <FloatingToast message={toastMessage} />
      </>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="text-brand-grey-light text-sm">
          {`${favoriteEvents.length} ${t("my_agenda.saved_count", "saved event(s)")} · ${t("my_agenda.sorted_nearest", "sorted by nearest")}`}
        </div>
        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm(
              t(
                "my_agenda.confirm_clear",
                "Do you want to remove all favorites?",
              ),
            );
            if (confirmed) {
              clearFavorites();
              setToastMessage(
                t(
                  "my_agenda.cleared_success",
                  "Favorites cleared successfully.",
                ),
              );
            }
          }}
          className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-brand-grey-dark/50 text-brand-grey hover:text-white hover:border-brand-red transition-colors"
        >
          <FaTrashAlt size={12} />
          {t("my_agenda.clear_all", "Clear all")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {favoriteEvents.map((event) => (
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

      <FloatingToast message={toastMessage} />
    </>
  );
}
