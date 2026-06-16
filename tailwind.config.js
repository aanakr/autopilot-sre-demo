/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#0A0A0A', // Deep black background
          800: '#121212', // Card backgrounds
          700: '#1A1A1A', // Elevated surfaces
          600: '#2A2A2A', // Borders
          500: '#3A3A3A', // Subtle borders
        },
        electric: {
          green: '#00DC82', // Primary accent (CTAs, success)
          cyan: '#00B4D8',  // Secondary accent (links, highlights)
        },
        danger: '#FF4558',  // Critical alerts
        warning: '#F59E0B', // Warning states
        success: '#10B981', // Success states
        muted: '#6B7280',   // Secondary text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}
