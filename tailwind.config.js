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
          900: '#0B0E14', // Primary canvas background
          800: '#131722', // Panels & cards
          700: '#1F2430', // Borders & strokes
          600: '#2A3042', // Hover states
          500: '#3A4155', // Subtle borders
        },
        electric: {
          green: '#10B981',  // Verified telemetry / SLOs / success
          glow: '#00F0FF',   // High-emphasis verified glow accent
          cyan: '#06B6D4',   // AI signals / links / highlights
        },
        danger: '#EF4444',  // Critical alerts
        warning: '#F59E0B', // Pending approvals
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
