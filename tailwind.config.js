/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
    "./src/renderer/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cozy Bear Cafe inspired palette
        cozy: {
          // Primary backgrounds and surfaces
          cream: '#fdf2ed',           // Main background - warm, soft
          'warm-pink': '#efccd2',     // Accent elements - gentle blush
          'sage-green': '#2a5965',    // Text and borders - earthy calm
          tan: '#a66041',             // CTA buttons - rich warmth
          'rosy-brown': '#B89088',    // Secondary text - muted elegance
          'white-chocolate': '#ECE6DB', // Card backgrounds - creamy comfort
          bone: '#E8D6CA',            // Subtle variations - natural softness
          'soft-orange': '#FFA756',   // Accent highlights - gentle energy
          
          // Extended palette for depth
          'dusty-rose': '#D4A5A5',    // Hover states
          'warm-gray': '#8B7D77',     // Disabled states
          'cream-dark': '#F5E6D3',    // Subtle backgrounds
          'sage-light': '#E1E6D1',    // Light sage for backgrounds
          
          // Dark mode variants
          'dark-brown': '#4A3C2A',    // Dark mode primary text
          'forest': '#2F4F2F',        // Dark mode accents
          'charcoal': '#3A3A3A',      // Dark mode backgrounds
        }
      },
      fontFamily: {
        // Cozy typography stack
        'serif': ['Merriweather', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'cozy': ['Poppins', 'Inter', 'system-ui', 'sans-serif'], // Rounded, friendly
      },
      fontSize: {
        // Generous, readable sizes
        'cozy-xs': ['0.75rem', { lineHeight: '1.6' }],
        'cozy-sm': ['0.875rem', { lineHeight: '1.6' }],
        'cozy-base': ['1rem', { lineHeight: '1.7' }],
        'cozy-lg': ['1.125rem', { lineHeight: '1.7' }],
        'cozy-xl': ['1.25rem', { lineHeight: '1.6' }],
        'cozy-2xl': ['1.5rem', { lineHeight: '1.5' }],
        'cozy-3xl': ['1.875rem', { lineHeight: '1.4' }],
      },
      spacing: {
        // Generous, breathable spacing
        'cozy-xs': '0.5rem',   // 8px
        'cozy-sm': '0.75rem',  // 12px
        'cozy-md': '1rem',     // 16px
        'cozy-lg': '1.5rem',   // 24px
        'cozy-xl': '2rem',     // 32px
        'cozy-2xl': '3rem',    // 48px
        'cozy-3xl': '4rem',    // 64px
        'cozy-4xl': '6rem',    // 96px
      },
      borderRadius: {
        // Soft, organic corners
        'cozy-sm': '0.5rem',   // 8px
        'cozy-md': '0.75rem',  // 12px
        'cozy-lg': '1rem',     // 16px
        'cozy-xl': '1.5rem',   // 24px
        'cozy-2xl': '2rem',    // 32px
      },
      boxShadow: {
        // Soft, warm shadows
        'cozy-sm': '0 2px 8px rgba(166, 96, 65, 0.1)',
        'cozy-md': '0 4px 16px rgba(166, 96, 65, 0.15)',
        'cozy-lg': '0 8px 24px rgba(166, 96, 65, 0.2)',
        'cozy-xl': '0 12px 32px rgba(166, 96, 65, 0.25)',
        
        // Inner shadows for depth
        'cozy-inner': 'inset 0 2px 4px rgba(166, 96, 65, 0.1)',
        'cozy-inner-lg': 'inset 0 4px 8px rgba(166, 96, 65, 0.15)',
      },
      animation: {
        // Gentle, organic animations
        'cozy-fade-in': 'cozyFadeIn 0.7s ease-out',
        'cozy-slide-up': 'cozySlideUp 0.5s ease-out',
        'cozy-bounce': 'cozyBounce 0.6s ease-out',
        'cozy-pulse': 'cozyPulse 2s ease-in-out infinite',
      },
      keyframes: {
        cozyFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cozySlideUp: {
          '0%': { opacity: '0', transform: 'translateY(2rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cozyBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
        cozyPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backdropBlur: {
        'cozy': '8px',
      },
      screens: {
        // Responsive breakpoints optimized for desktop app
        'cozy-sm': '640px',
        'cozy-md': '768px', 
        'cozy-lg': '1024px',
        'cozy-xl': '1280px',
      }
    },
  },
  plugins: [
    // Custom utilities for cozy design
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Cozy button variants
        '.btn-cozy-primary': {
          '@apply px-cozy-lg py-cozy-md rounded-cozy-lg bg-cozy-tan text-cozy-cream shadow-cozy-md hover:shadow-cozy-lg hover:bg-opacity-90 transition-all duration-200 font-medium': {},
        },
        '.btn-cozy-secondary': {
          '@apply px-cozy-lg py-cozy-md rounded-cozy-lg border-2 border-cozy-sage-green text-cozy-sage-green hover:bg-cozy-sage-green hover:text-cozy-cream transition-all duration-200': {},
        },
        '.btn-cozy-soft': {
          '@apply px-cozy-lg py-cozy-md rounded-cozy-lg bg-cozy-warm-pink text-cozy-sage-green hover:bg-cozy-dusty-rose transition-all duration-200': {},
        },
        
        // Cozy card variants
        '.card-cozy': {
          '@apply bg-cozy-white-chocolate rounded-cozy-xl shadow-cozy-lg p-cozy-xl border border-opacity-20 border-cozy-sage-green hover:shadow-cozy-xl transition-shadow duration-300': {},
        },
        '.card-cozy-textured': {
          '@apply bg-cozy-cream rounded-cozy-xl shadow-cozy-md p-cozy-lg relative overflow-hidden': {},
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            opacity: '0.05',
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,.05) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }
        },
        
        // Cozy input styles
        '.input-cozy': {
          '@apply w-full px-cozy-lg py-cozy-md text-cozy-lg rounded-cozy-lg border-2 border-cozy-sage-green border-opacity-30 focus:border-cozy-sage-green bg-cozy-cream text-cozy-sage-green shadow-cozy-sm focus:shadow-cozy-md transition-all duration-200': {},
          '&::placeholder': {
            '@apply text-cozy-rosy-brown': {},
          }
        },
        
        // Cozy typography
        '.text-cozy-heading': {
          '@apply text-cozy-2xl md:text-cozy-3xl font-serif text-cozy-tan leading-relaxed': {},
        },
        '.text-cozy-subheading': {
          '@apply text-cozy-xl md:text-cozy-2xl font-serif text-cozy-sage-green leading-relaxed': {},
        },
        '.text-cozy-body': {
          '@apply text-cozy-base text-cozy-rosy-brown leading-loose font-cozy': {},
        },
        
        // Cozy spacing
        '.section-cozy': {
          '@apply py-cozy-3xl md:py-cozy-4xl px-cozy-md md:px-cozy-xl': {},
        },
        '.container-cozy': {
          '@apply max-w-6xl mx-auto space-y-cozy-2xl md:space-y-cozy-3xl': {},
        },
        
        // Cozy hover effects
        '.hover-cozy': {
          '@apply transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1': {},
        },
        '.hover-cozy-subtle': {
          '@apply transform transition-all duration-200 ease-out hover:scale-102 hover:-translate-y-0.5': {},
        },
        
        // Pixel art preservation
        '.pixel-perfect': {
          'image-rendering': 'pixelated',
          '-webkit-font-smoothing': 'none',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}