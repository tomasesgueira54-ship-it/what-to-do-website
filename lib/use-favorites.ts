"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "wtd:favorites:event-ids";

function parseStoredIds(value: string | null): string[] {
    if (!value) return [];
    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((id): id is string => typeof id === "string");
    } catch {
        return [];
    }
}

export function useFavorites() {
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        return parseStoredIds(window.localStorage.getItem(STORAGE_KEY));
    });
    const [isHydrated] = useState(() => typeof window !== "undefined");

    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY) return;
            setFavoriteIds(parseStoredIds(event.newValue));
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const persist = useCallback((ids: string[]) => {
        setFavoriteIds(ids);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }, []);

    const isFavorite = useCallback(
        (eventId: string) => favoriteIds.includes(eventId),
        [favoriteIds],
    );

    const toggleFavorite = useCallback(
        (eventId: string) => {
            setFavoriteIds((currentIds) => {
                const next = currentIds.includes(eventId)
                    ? currentIds.filter((id) => id !== eventId)
                    : [...currentIds, eventId];
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                return next;
            });
        },
        [],
    );

    const clearFavorites = useCallback(() => {
        persist([]);
    }, [persist]);

    const favoriteCount = useMemo(() => favoriteIds.length, [favoriteIds]);

    return {
        favoriteIds,
        favoriteCount,
        isHydrated,
        isFavorite,
        toggleFavorite,
        clearFavorites,
    };
}
