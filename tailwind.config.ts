import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#0A0E1A',
          elev: '#141926',
          card: '#1A2030',
          deep: '#06080F',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.18)',
          soft: 'rgba(255,255,255,0.06)',
        },
        hi: '#F4F6FB',
        lo: '#8892A6',

        magenta: {
          DEFAULT: '#FF2E63',
          soft: 'rgba(255,46,99,0.14)',
          dim: '#B81E48',
        },
        cyan: {
          DEFAULT: '#22D3EE',
          soft: 'rgba(34,211,238,0.14)',
          dim: '#0E9CB4',
        },
        lime: {
          DEFAULT: '#A3FF3C',
          soft: 'rgba(163,255,60,0.14)',
          dim: '#5FB31E',
        },
        sun: {
          DEFAULT: '#FFD60A',
          soft: 'rgba(255,214,10,0.14)',
        },
        flame: {
          DEFAULT: '#FF6B35',
          soft: 'rgba(255,107,53,0.14)',
        },

        // Legacy aliases (kept so existing components compile during transition)
        canvas: '#0A0E1A',
        ink: '#F4F6FB',
        muted: '#8892A6',
        have: {
          DEFAULT: '#A3FF3C',
          soft: 'rgba(163,255,60,0.14)',
        },
        dup: {
          DEFAULT: '#22D3EE',
          soft: 'rgba(34,211,238,0.14)',
          gold: '#FFD60A',
        },
        miss: {
          DEFAULT: 'rgba(255,255,255,0.30)',
          soft: 'rgba(255,255,255,0.04)',
        },
      },
      fontFamily: {
        sans: [
          '"Hanken Grotesk"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        display: [
          '"Big Shoulders Display"',
          '"Hanken Grotesk"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.25)',
        'glow-magenta':
          '0 0 0 1px rgba(255,46,99,0.4), 0 8px 30px -8px rgba(255,46,99,0.6)',
        'glow-cyan':
          '0 0 0 1px rgba(34,211,238,0.4), 0 8px 30px -8px rgba(34,211,238,0.6)',
        'glow-lime':
          '0 0 0 1px rgba(163,255,60,0.5), 0 8px 30px -8px rgba(163,255,60,0.65)',
        'glow-sun':
          '0 0 0 1px rgba(255,214,10,0.5), 0 8px 30px -8px rgba(255,214,10,0.55)',
        'inset-line': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backgroundImage: {
        halftone:
          'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.2px)',
        'halftone-strong':
          'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1.2px)',
        'diagonal-stripes':
          'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 16px)',
        'grad-energy':
          'linear-gradient(90deg, #FF2E63 0%, #FFD60A 50%, #A3FF3C 100%)',
        'grad-energy-soft':
          'linear-gradient(90deg, rgba(255,46,99,0.85), rgba(255,214,10,0.85) 50%, rgba(163,255,60,0.85))',
      },
      backgroundSize: {
        halftone: '14px 14px',
        'halftone-lg': '22px 22px',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'pop-in': 'pop-in 320ms cubic-bezier(.16,1,.3,1)',
        'fade-up': 'fade-up 360ms ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
