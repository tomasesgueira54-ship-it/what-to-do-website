/** @type {import('next').NextConfig} */
const nextConfig = {
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
