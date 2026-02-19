"use client";

import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useFavorites } from "@/lib/use-favorites";
import { useTranslations } from "@/lib/use-translations";
import FloatingToast from "@/components/FloatingToast";

interface FavoriteEventButtonProps {
  eventId: string;
  locale?: "pt" | "en";
  className?: string;
}

export default function FavoriteEventButton({
  eventId,
  locale = "pt",
  className = "",
}: FavoriteEventButtonProps) {
  const { isHydrated, isFavorite, toggleFavorite } = useFavorites();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = useTranslations(locale);

  const favorite = isHydrated ? isFavorite(eventId) : false;

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setToastMessage(
            favorite
              ? t("favorites.removed", "Removed from favorites")
              : t("favorites.added", "Added to favorites"),
          );
          toggleFavorite(eventId);
        }}
        aria-pressed={favorite}
        aria-label={
          favorite
            ? t("favorites.remove", "Remove from favorites")
            : t("favorites.add", "Add to favorites")
        }
        className={`w-full flex items-center justify-center gap-2 mb-3 px-4 py-3 font-bold rounded shadow transition-all ${
          favorite
            ? "bg-brand-red text-white hover:bg-red-700"
            : "bg-brand-black border border-brand-grey-dark/40 text-white hover:border-brand-red"
        } ${className}`}
      >
        <FaHeart size={14} />
        {favorite
          ? t("favorites.saved", "Saved")
          : t("favorites.save_event", "Save Event")}
      </button>

      <FloatingToast message={toastMessage} />
    </>
  );
}
