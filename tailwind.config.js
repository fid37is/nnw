/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Naija Green (from your original config)
        'naija-green': {
          50: '#f0fdf9',
          100: '#dcfdf3',
          200: '#bbfbe8',
          300: '#88f7d9',
          400: '#4eeec9',
          500: '#22deb8',
          600: '#10c084',
          700: '#007a5e',
          800: '#06614c',
          900: '#054d3f',
        },
        
        // Alias primary to naija-green
        primary: {
          50: '#f0fdf9',
          100: '#dcfdf3',
          200: '#bbfbe8',
          300: '#88f7d9',
          400: '#4eeec9',
          500: '#22deb8',
          600: '#10c084',
          700: '#007a5e',
          800: '#06614c',
          900: '#054d3f',
          DEFAULT: '#10c084',
          foreground: '#ffffff',
        },
        
        // Naija Gold - Secondary/Accent
        'naija-gold': '#FFD700',
        
        // Naija Red - For errors/alerts
        'naija-red': '#E74C3C',
        
        // Secondary - Gold accent
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFD700',  // Naija Gold
          600: '#d4af37',
          700: '#b8860b',
          800: '#9a7306',
          900: '#7c5e02',
          DEFAULT: '#FFD700',
          foreground: '#000000',
        },

        // Accent - Fresh Mint
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          DEFAULT: '#14b8a6',
          foreground: '#ffffff',
        },

        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          DEFAULT: '#22c55e',
          foreground: '#ffffff',
        },
        
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        destructive: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },

        // Neutral colors
        background: '#ffffff',
        foreground: '#0a0a0a',
        
        card: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
        
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#0a0a0a',
        },
        
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#10b981',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      boxShadow: {
        'soft': '0 2px 8px rgba(16, 185, 129, 0.1)',
        'medium': '0 4px 16px rgba(16, 185, 129, 0.15)',
        'hard': '0 8px 32px rgba(16, 185, 129, 0.2)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}