/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Premium neutral scale
        ink:    '#0a0d12',
        'ink-2':'#1a1d23',
        'ink-3':'#3a4150',
        'ink-4':'#6b7280',
        'ink-5':'#9aa3b2',
        line:   'rgba(10, 13, 18, 0.08)',
        'line-2': 'rgba(10, 13, 18, 0.05)',
        soft:   '#f7f8fa',
        cream:  '#fafaf8',
        warm:   '#fbf9f5',

        // Brand accents
        loki:   '#c8102e',
        nova:   '#f5b400',
        hilde:  '#0a6cf0',
        tt:     '#7a3fc8',
        fx:     '#ff6b35',
        ki:     '#1f8a3a',
        yellow: '#f5b400'
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      maxWidth: { wrap: '1240px' },
      letterSpacing: {
        tightest: '-0.045em',
        tighter:  '-0.03em',
        tight:    '-0.02em'
      }
    }
  },
  plugins: []
};
