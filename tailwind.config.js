/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'brand-red': '#8E0D3C',
                'brand-red-light': '#C10206',
                'brand-black': '#000000',
                'brand-black-light': '#111110',
                'brand-grey-dark': '#252523',
                'brand-grey': '#6E6E6E',
                'brand-grey-light': '#AAAAAA',
                'brand-white': '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0)' },
                    '100%': { transform: 'scale(1)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
