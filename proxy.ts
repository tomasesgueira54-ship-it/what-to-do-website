import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const DEFAULT_LOCALE = "pt";

function isPartnersProtectedPath(pathname: string): boolean {
    if (/^\/api\/partners\/export(?:\/|$)/.test(pathname)) return true;
    return /^\/(pt|en)\/partners\/dashboard(?:\/|$)/.test(pathname);
}

function isExportPath(pathname: string): boolean {
    return /^\/api\/partners\/export(?:\/|$)/.test(pathname);
}

function isPartnersAuthorized(request: NextRequest): boolean {
    const expectedUser = process.env.PARTNERS_DASHBOARD_USER;
    const expectedPassword = process.env.PARTNERS_DASHBOARD_PASSWORD;
    const expectedToken = process.env.PARTNERS_DASHBOARD_TOKEN;
    const pathname = request.nextUrl.pathname;

    const hasBasicAuthConfig = Boolean(expectedUser && expectedPassword);
    const hasTokenConfig = Boolean(expectedToken);
    const exportPath = isExportPath(pathname);

    if (!hasBasicAuthConfig && !(exportPath && hasTokenConfig)) {
        return false;
    }

    if (hasBasicAuthConfig) {
        const auth = request.headers.get("authorization");
        if (auth && auth.startsWith("Basic ")) {
            try {
                const encoded = auth.slice("Basic ".length).trim();
                const decoded = atob(encoded);
                const separator = decoded.indexOf(":");
                if (separator >= 0) {
                    const user = decoded.slice(0, separator);
                    const password = decoded.slice(separator + 1);
                    if (user === expectedUser && password === expectedPassword) {
                        return true;
                    }
                }
            } catch {
                return false;
            }
        }
    }

    if (exportPath && hasTokenConfig) {
        const token = request.nextUrl.searchParams.get("token");
        if (token && token === expectedToken) {
            return true;
        }
    }

    return false;
}

function getPreferredLocale(request: NextRequest): string {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as (typeof SUPPORTED_LOCALES)[number])) {
        return cookieLocale;
    }

    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferred = acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase().slice(0, 2))
        .find((lang) => SUPPORTED_LOCALES.includes(lang as (typeof SUPPORTED_LOCALES)[number]));

    return preferred || DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPartnersProtectedPath(pathname) && !isPartnersAuthorized(request)) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": 'Basic realm="What To Do Partners Dashboard"',
            },
        });
    }

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/audio") ||
        pathname.startsWith("/video") ||
        pathname.startsWith("/podcasts") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const hasLocale = SUPPORTED_LOCALES.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );

    // Refresh Supabase auth session (keeps cookies fresh)
    const response = hasLocale
        ? NextResponse.next()
        : NextResponse.redirect(new URL(`/${getPreferredLocale(request)}${pathname}`, request.url));

    refreshSupabaseSession(request, response);

    return response;
}

/**
 * Refresh Supabase auth session on every request.
 * This keeps the auth cookies fresh and valid.
 */
function refreshSupabaseSession(request: NextRequest, response: NextResponse) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, skip session refresh
    if (!supabaseUrl || !supabaseAnonKey) return;

    try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        });

        // getUser() validates the JWT — do NOT use getSession() here
        supabase.auth.getUser();
    } catch (error) {
        console.error("[proxy] Supabase session refresh error:", error);
    }
}

export const config = {
    matcher: ["/((?!_next|images|audio|video|podcasts|favicon.ico).*)"],
};