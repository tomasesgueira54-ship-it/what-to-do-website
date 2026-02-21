export function isSupabaseConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    return Boolean(
        url &&
        anonKey &&
        (url.startsWith("http://") || url.startsWith("https://"))
    );
}
