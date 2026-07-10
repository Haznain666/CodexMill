/** @type {import('tailwindcss').Config} */

/*
 * CodexMill brand tokens — SINGLE SOURCE for color, type, motion.
 * White is the prime canvas. Navy is text + dark feature bands.
 * Forge Orange = primary CTAs / key highlights ONLY. Circuit Blue = secondary accent.
 * [CONFIRM] hex values against final brand assets (per CLAUDE.md §4.1).
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        // Canvas
        white: '#FFFFFF',
        mist: '#F7F9FC', // secondary canvas / alternating sections
        // Ink
        navy: {
          DEFAULT: '#0B1A30', // Midnight Navy — headings & dark bands
          900: '#0B1A30',
          800: '#13233D',
          700: '#1C3052',
        },
        slate: {
          DEFAULT: '#41505F', // body text (8.3:1 on white)
        },
        // Muted text — darkened from #7C8A99 to clear AA (4.5:1) for small text. [CONFIRM]
        cool: '#5C6775',
        hairline: '#E6EBF1', // borders / dividers
        // Accents
        forge: {
          DEFAULT: '#F26419', // Forge Orange — primary CTA / fills / LARGE text only (3.2:1)
          500: '#F47A3C', // lighter — for orange text on NAVY bands
          600: '#D9530F', // darker hover
          50: '#FEF1EA', // pale wash for tints/blobs
        },
        // Ember — orange for SMALL text on light surfaces (4.8:1, clears AA). Use instead of
        // `forge` for eyebrows, taglines, and small accents per CLAUDE.md §4.1 contrast rule.
        ember: '#C24E12',
        circuit: {
          DEFAULT: '#2E9BE6', // Circuit Blue — secondary accent
        },
      },
      fontFamily: {
        // Headlines: Barlow. Body: Inter. Wired to @fontsource imports in global.css.
        display: ['Barlow', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Confident display scale for big headlines
        'display-sm': ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display': ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['4.25rem', { lineHeight: '1.02', letterSpacing: '-0.025em', fontWeight: '800' }],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        // Soft, layered, premium — never harsh
        soft: '0 8px 24px rgba(11,26,48,0.06)',
        card: '0 18px 40px rgba(11,26,48,0.08)',
        glass: '0 20px 45px rgba(11,26,48,0.10)',
        glow: '0 12px 30px rgba(242,100,25,0.28)', // forge CTA glow on hover
      },
      backgroundImage: {
        // Accent gradient — used sparingly (hero highlight word, CTA hover, badges, dividers)
        'forge-blue': 'linear-gradient(90deg, #F26419 0%, #2E9BE6 100%)',
        'forge-blue-soft': 'linear-gradient(120deg, rgba(242,100,25,0.12) 0%, rgba(46,155,230,0.12) 100%)',
      },
      backdropBlur: {
        glass: '16px',
      },
      transitionTimingFunction: {
        // Premium reveal easing
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(24px, -18px) scale(1.06)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.7' },
          '70%': { transform: 'scale(1.3)', opacity: '0' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite',
      },
    },
  },
  plugins: [],
};
