module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: { DEFAULT: '0.75rem', sm: '0.875rem', lg: '1rem' } },
    screens: { sm: '640px', md: '768px', lg: '1024px' },
    extend: {
      borderRadius: { '1.5xl': '0.875rem' },
      borderWidth: { 6: '6px', 7: '7px' },
      colors: { fujiiro: '#AFB4DB', wisteria: '#8689C3' },
      spacing: {
        1.75: '0.4375rem',
        '57px': '57px',
        '65px': '65px',
        '73px': '73px',
        '121px': '121px',
        '137px': '137px',
      },
    },
  },
  variants: {
    scrollPadding: ['responsive'],
    extend: {
      ringWidth: ['focus-visible', 'hover'],
      textColor: ['focus-visible'],
      textDecoration: ['focus-visible'],
    },
  },
  plugins: [require('tailwindcss-scroll-snap')],
};
