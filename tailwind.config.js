/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cinematic Library Tokens
        library: {
          950: '#080808', // Deep espresso / obsidian void
          900: '#10131b', // Deep paper / cabinet shadow
          850: '#141822', // Subtle recess
          800: '#171a24', // Library desk surface
          750: '#1c212e', // Elevated panel
          700: '#262c3d', // Card boundary
          600: '#3a4256', // Fine divider
        },
        walnut: {
          DEFAULT: '#3a2118',
          deep: '#1c0e0a',
          light: '#533226',
        },
        copper: {
          DEFAULT: '#c87046',
          hover: '#b56138',
          glow: 'rgba(200, 112, 70, 0.25)',
          subtle: 'rgba(200, 112, 70, 0.12)',
        },
        ink: {
          DEFAULT: '#f4eee6', // High-legibility cream
          soft: '#b9b4ae',    // Editorial body muted
          faint: '#78736d',   // Microcopy / captions
          pale: '#f1eadf',    // Paper highlight
        },
        rule: {
          DEFAULT: 'rgba(244, 238, 230, 0.14)',
          subtle: 'rgba(244, 238, 230, 0.08)',
          prominent: 'rgba(244, 238, 230, 0.24)',
        },
        // Semantic accents (restrained)
        amber: {
          DEFAULT: '#d49b4b',
          glow: 'rgba(212, 155, 75, 0.25)',
        },
        sage: {
          DEFAULT: '#5e8f77',
          glow: 'rgba(94, 143, 119, 0.25)',
        },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', 'Georgia', 'Baskerville', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', 'monospace'],
      },
      boxShadow: {
        'library': '0 12px 36px -8px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(244, 238, 230, 0.08)',
        'copper-glow': '0 0 24px -4px rgba(200, 112, 70, 0.35)',
        'book': '0 16px 40px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(244, 238, 230, 0.12)',
      },
    },
  },
  plugins: [],
};
