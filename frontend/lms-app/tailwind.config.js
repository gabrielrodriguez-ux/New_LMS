/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1e3740', // ThePower Dark Blue
                    light: '#2c4d59',
                },
                secondary: {
                    DEFAULT: '#a1e6c5', // ThePower Mint
                    dark: '#8acba8',
                },
                accent: {
                    DEFAULT: '#98d3b6', // ThePower Green
                },
                surface: {
                    DEFAULT: '#ffffff',
                    muted: '#f8fafc',
                    dark: '#1e293b'
                }
            },
            fontFamily: {
                sans: ['var(--font-poppins)'],
            }
        },
    },
    plugins: [],
}
