/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#fef9ef', // Primary canvas
          50: '#ffffff',
          100: '#fef9ef',
          200: '#f5eee1',   // Aged Paper surface
          300: '#ede4d3',   // Surface hover
          400: '#d1c9bf',   // Warm Taupe border
          500: '#b8ada0',
        },
        ink: {
          DEFAULT: '#2a2b2f', // Primary high-emphasis text
          dark: '#1a1b1e',
          charcoal: '#333333', // Secondary body
          graphite: '#515151', // Metadata & subtext
          muted: '#78716c',
        },
        terracotta: {
          DEFAULT: '#b05a36', // Primary Action Accent
          hover: '#9c4f2f',
          light: '#faede8',
          subtle: '#f3dacf',
          dark: '#7c3b20',
        },
        clinical: {
          confirmed: '#15803d',
          'confirmed-bg': '#dcfce7',
          'confirmed-border': '#86efac',
          documented: '#1e40af',
          'documented-bg': '#dbeafe',
          'documented-border': '#93c5fd',
          uncertain: '#b45309',
          'uncertain-bg': '#fef3c7',
          'uncertain-border': '#fde68a',
          conflict: '#b91c1c',
          'conflict-bg': '#fee2e2',
          'conflict-border': '#fca5a5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'pill': '40px',
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(42, 43, 47, 0.05), 0 1px 2px rgba(42, 43, 47, 0.03)',
        'warm': '0 4px 14px rgba(42, 43, 47, 0.06), 0 2px 6px rgba(42, 43, 47, 0.03)',
        'warm-lg': '0 10px 25px rgba(42, 43, 47, 0.08), 0 4px 10px rgba(42, 43, 47, 0.04)',
        'warm-xl': '0 20px 35px rgba(42, 43, 47, 0.10), 0 8px 16px rgba(42, 43, 47, 0.05)',
      }
    },
  },
  plugins: [],
}
