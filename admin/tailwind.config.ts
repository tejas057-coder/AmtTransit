import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          page: '#0D0D0D',
          card: '#1A1A1A',
          elevated: '#222222',
          sidebar: '#111111',
        },
        // Primary
        primary: {
          DEFAULT: '#FFD000',
          hover: '#E6BB00',
          light: '#FFD00022',
        },
        // Status
        status: {
          danger: '#FF4444',
          success: '#22C55E',
          warning: '#FF9900',
          info: '#3B82F6',
        },
        // Borders
        border: {
          DEFAULT: '#2A2A2A',
          muted: '#1A1A1A',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#E5E5E5',
          muted: '#888888',
          inverse: '#0D0D0D',
        },
        // Semantic
        semantic: {
          warningBg: '#FF990022',
          dangerBg: '#FF444422',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        xxxl: '40px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        'admin-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        admin: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'admin-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'admin-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'admin-xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
        'primary-glow': '0 0 20px rgba(255, 208, 0, 0.15)',
        'danger-glow': '0 0 20px rgba(255, 68, 68, 0.15)',
      },
      zIndex: {
        base: '0',
        dropdown: '10',
        sticky: '20',
        sidebar: '30',
        header: '40',
        modal: '50',
        tooltip: '60',
        notification: '70',
      },
      spacing: {
        headerHeight: '56px',
        sidebarWidth: '240px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
