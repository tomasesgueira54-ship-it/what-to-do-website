import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["pt", "en"] as const;
const DEFAULT_LOCALE = "pt";

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

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/audio") ||
        pathname.startsWith("/video") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hasLocale = SUPPORTED_LOCALES.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );
    if (hasLocale) {
        return NextResponse.next();
    }

    const locale = getPreferredLocale(request);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
    matcher: ["/((?!_next|api|images|audio|video|favicon.ico).*)"],
};