/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B0F19',
          DEFAULT: '#111827',
          light: '#1F2937',
        },
        indigo: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#818CF8',
          subtle: '#EEF2FF',
        },
        surface: {
          bg: '#F9FAFB',
          card: '#FFFFFF',
          border: '#E5E7EB',
        },
        content: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        status: {
          success: '#16A34A',
          error: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

