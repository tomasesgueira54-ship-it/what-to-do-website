/** @type {import('next').NextConfig} */
const devAllowedOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const nextConfig = {
    allowedDevOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:3002',
        'http://127.0.0.1:3003',
        'http://192.168.1.160:3000',
        'http://192.168.1.160:3001',
        'http://192.168.1.160:3002',
        'http://192.168.1.160:3003',
        ...devAllowedOrigins,
    ],
    async headers() {
        return [
            {
                source: '/images/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/audio/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/podcasts/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/video/:path*',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai data:; connect-src 'self' https: ws: wss:; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; frame-ancestors 'none';",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'www.agendalx.pt' },
            { protocol: 'https', hostname: 'www.bol.pt' },
            { protocol: 'https', hostname: 'bol.pt' },
            { protocol: 'https', hostname: 'bolimg.blob.core.windows.net' },
            { protocol: 'https', hostname: 'secure.meetupstatic.com' },
            { protocol: 'https', hostname: 'applications-media.feverup.com' },
            { protocol: 'https', hostname: 'img.evbuc.com' },
            { protocol: 'https', hostname: 'cdn.evbstatic.com' },
            { protocol: 'https', hostname: 'images.xceed.me' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 7,
        dangerouslyAllowSVG: true,
    },
    experimental: {
        optimizeCss: true,
    },
};

module.exports = nextConfig;
