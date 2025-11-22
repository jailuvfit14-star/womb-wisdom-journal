import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Soft, ethereal color palette - womb-healing aesthetic
      colors: {
        // Blush tones
        blush: {
          50: '#fef6f6',
          100: '#fdeced',
          200: '#fbd9db',
          300: '#f7b5ba',
          400: '#f28b93',
          500: '#e8696f',
          600: '#d24854',
          700: '#b13542',
        },
        // Warm cream tones
        cream: {
          50: '#fdfcfa',
          100: '#faf7f3',
          200: '#f5efe7',
          300: '#ebe1d4',
          400: '#dcc9b5',
          500: '#c9ad93',
        },
        // Soft clay / terracotta
        clay: {
          50: '#faf6f4',
          100: '#f4ebe6',
          200: '#e8d4c9',
          300: '#d8b6a3',
          400: '#c4947a',
          500: '#b07a5e',
          600: '#9a6449',
          700: '#7d5039',
        },
        // Muted cocoa / warm browns
        cocoa: {
          50: '#f7f5f3',
          100: '#ebe6e2',
          200: '#d8cec5',
          300: '#bfafa1',
          400: '#a4907f',
          500: '#8d7566',
          600: '#705d51',
          700: '#5a4a40',
          800: '#483933',
        },
      },
      // Elegant font families
      fontFamily: {
        // Serif for headers - elegant and soft
        serif: ['var(--font-playfair)', 'Georgia', 'Cambria', 'serif'],
        // Clean sans-serif for body text
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Gentle rounded corners throughout
      borderRadius: {
        'soft': '12px',
        'softer': '16px',
        'softest': '20px',
      },
    },
  },
  plugins: [],
}
export default config
