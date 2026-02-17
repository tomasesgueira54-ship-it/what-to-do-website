import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { episodes } from "@/data/episodes";
import events from "@/data/events.json";

type EventRow = {
    id: string;
    date?: string;
};

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://whattodo.pt";
    const now = new Date();

    const staticRoutes = [
        "",
        "/pt",
        "/en",
        "/pt/about",
        "/en/about",
        "/pt/events",
        "/en/events",
        "/pt/episodes",
        "/en/episodes",
        "/pt/blog",
        "/en/blog",
        "/pt/privacy",
        "/en/privacy",
        "/pt/terms",
        "/en/terms",
    ];

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: route === "/pt" || route === "/en" || route === "" ? 1 : 0.7,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) => [
        {
            url: `${siteUrl}/pt/blog/${post.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/en/blog/${post.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ]);

    const episodeEntries: MetadataRoute.Sitemap = episodes.flatMap((episode) => [
        {
            url: `${siteUrl}/pt/episodes/${episode.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/en/episodes/${episode.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ]);

    const eventEntries: MetadataRoute.Sitemap = (events as EventRow[]).flatMap((event) => {
        const lastModified = event.date ? new Date(event.date) : now;

        return [
            {
                url: `${siteUrl}/pt/events/${event.id}`,
                lastModified,
                changeFrequency: "daily",
                priority: 0.8,
            },
            {
                url: `${siteUrl}/en/events/${event.id}`,
                lastModified,
                changeFrequency: "daily",
                priority: 0.8,
            },
        ];
    });

    return [...staticEntries, ...blogEntries, ...episodeEntries, ...eventEntries];
}
