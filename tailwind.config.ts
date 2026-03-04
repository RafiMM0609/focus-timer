import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts}',
    './pages/**/*.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // Mode colors
        pomodoro: {
          DEFAULT: '#FF3A5C',
          light: '#FFD6DD',
          dark: '#CC0E30',
        },
        work52: {
          DEFAULT: '#5B5BD6',
          light: '#E0E0FF',
          dark: '#3333AA',
        },
        custom: {
          DEFAULT: '#00C896',
          light: '#C6FFF0',
          dark: '#009970',
        },
        flow: {
          DEFAULT: '#FF8800',
          light: '#FFE8C0',
          dark: '#CC6A00',
        },
        // Base palette
        ink: '#0D0D0D',
        paper: '#FAFF00',
        cream: '#FAFAF0',
        muted: '#F0F0E8',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px #0D0D0D',
        'brutal-lg': '6px 6px 0px #0D0D0D',
        'brutal-xl': '8px 8px 0px #0D0D0D',
        'brutal-sm': '2px 2px 0px #0D0D0D',
        'brutal-inset': 'inset 3px 3px 0px #0D0D0D',
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
