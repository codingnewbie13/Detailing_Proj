/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces — matte black to slate
        ink: {
          950: '#060608',
          900: '#0a0a0c',
          850: '#0f0f13',
          800: '#141418',
          700: '#1b1b21',
          600: '#25252d',
          500: '#32323c',
          400: '#4a4a56',
        },
        // Single electric accent (primary/focus only)
        blue: {
          DEFAULT: '#2E6BFF',
          50: '#eaf1ff',
          100: '#d6e2ff',
          300: '#7ea3ff',
          400: '#5583ff',
          500: '#2e6bff',
          600: '#1f52d6',
          700: '#1840a8',
        },
        // Success — lime
        lime: {
          DEFAULT: '#A3E635',
          soft: '#c6f26a',
          deep: '#78b91a',
        },
        // Warning / danger
        amber: { DEFAULT: '#f5b544', deep: '#c88a1f' },
        rose: { DEFAULT: '#ff6b6b', deep: '#d64545' },
        // Luxury warmth — thin champagne hairline only
        champagne: { DEFAULT: '#d8c08a', soft: '#e7d3a1', deep: '#9a7b3f' },
        line: 'rgba(255,255,255,0.08)',
        'line-strong': 'rgba(255,255,255,0.14)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -28px rgba(0,0,0,0.85)',
        float: '0 30px 70px -24px rgba(0,0,0,0.75)',
        'glow-blue': '0 0 0 1px rgba(46,107,255,0.35), 0 12px 40px -12px rgba(46,107,255,0.45)',
        'glow-lime': '0 0 0 1px rgba(163,230,53,0.30), 0 12px 40px -14px rgba(163,230,53,0.35)',
        press: '0 1px 2px rgba(0,0,0,0.6) inset',
      },
      backgroundImage: {
        'mesh-lux':
          'radial-gradient(900px 480px at 85% -12%, rgba(46,107,255,0.10), transparent 60%), radial-gradient(760px 460px at -12% 8%, rgba(216,192,138,0.06), transparent 60%)',
        'gold-hair': 'linear-gradient(90deg, transparent, rgba(216,192,138,0.55), transparent)',
        'sheen': 'linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.06) 50%, transparent 80%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
