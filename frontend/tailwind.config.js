/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        desktop: {
          bg: '#0a0e1a',
          surface: '#111827',
          border: '#1e3a5f',
          accent: '#00d4ff',
          accent2: '#00ff88',
          text: '#c8d8e8',
          dim: '#4a6a8a',
          warn: '#ffaa00',
          error: '#ff4444',
        }
      }
    },
  },
  plugins: [],
};
