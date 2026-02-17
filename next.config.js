/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https:; frame-ancestors 'none';",
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
        ],
        formats: ['image/avif', 'image/webp'],
    },
    experimental: {
        optimizeCss: true,
    },
};

module.exports = nextConfig;
