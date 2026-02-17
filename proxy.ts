import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n.config';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Log incoming requests for debugging intermittent 500s
    try {
        console.log(`[proxy] ${new Date().toISOString()} ${request.method} ${pathname}`);
    } catch (e) {
        /* ignore logging errors */
    }

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    const acceptLanguage = request.headers.get('accept-language');
    let locale: 'pt' | 'en' = defaultLocale as 'pt' | 'en';

    if (acceptLanguage) {
        const preferredLocale = acceptLanguage
            .split(',')[0]
            .split('-')[0]
            .toLowerCase();

        if (locales.includes(preferredLocale as any)) {
            locale = preferredLocale as 'pt' | 'en';
        }
    }

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
    ],
};