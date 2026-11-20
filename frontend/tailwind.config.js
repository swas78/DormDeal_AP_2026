/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme Colors from design specification
        brand: {
          text: '#1c1c1d',
          border: '#1c1c1d',
          icon: '#464649',
          cream: '#FFFDF8',
          sand: '#FFF9EE',
          warm: '#FDF3E0',
          dark: '#1c1c1d',
        },
        'icon-default': '#464649',
        'icons-active': '#1c1c1d',
        navy: {
          900: '#111827',
          DEFAULT: '#1c1c1d',
          light: '#2a2a2d',
        },
        indigo: {
          DEFAULT: '#1c1c1d',
          dark: '#111112',
          light: '#4F46E5',
          subtle: '#FFF9EE',
        },
        surface: {
          bg: '#FFFDF8',
          card: '#FFFFFF',
          border: '#1c1c1d',
        },
        content: {
          primary: '#1c1c1d',
          secondary: '#464649',
          muted: '#6B7280',
        },
        status: {
          success: '#16A34A',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: [
          'Poppins',
          'Inter Variable',
          'Inter',
          'Helvetica',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'FlechaM',
          'Poppins',
          'Georgia',
          'serif',
        ],
      },
      letterSpacing: {
        'display-hero': '-2.4px',
        h4: '-1.2px',
        h5: '-0.96px',
        tight: '-0.04em',
        tighter: '-0.05em',
      },
      spacing: {
        18: '4.5rem',
        64: '16rem',
        'gutter': '64px',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(28, 28, 29, 0.05), 0 1px 2px 0 rgba(28, 28, 29, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(28, 28, 29, 0.12), 0 4px 8px -2px rgba(28, 28, 29, 0.06)',
        'sharp': '3px 3px 0px 0px #1c1c1d',
        'sharp-lg': '5px 5px 0px 0px #1c1c1d',
      },
    },
  },
  plugins: [],
};
