import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lm: '900px',
      lg: '1024px',
      xl: '1280px',

      smOnly: { max: '767.98px' },
      mdOnly: { min: '768px', max: '1279.98px' },
      notXL: { max: '1279.98px' },
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.25rem',
          md: '2rem',
          xl: '2rem',
        },
      },

      /**
       * 🚨 УДАЛЕНО: bg-backdrop — причина прозрачного бургер-меню
       * Если когда-нибудь понадобится, создадим другой класс.
       */
      backgroundImage: {
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      content: {
        arrow: `url(/icons/arrow-right.svg)`,
      },

      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        tenor: ['var(--font-tenor)'],
      },

      fontSize: {
        medium: ['28px', '1.28'],
        lightLarge: ['32px', '1.25'],
        large: ['40px', '1.2'],
        extraLarge: ['56px', '1.14'],
      },

      colors: {
        mainBcg: '#E5E1D5',
        footerBcg: '#D6D0C5',
        cardBcg: '#FAF5ED',

        // новая премиальная палитра
        accent: '#ffe8a3',
        hover: '#ffe8a3',
        pressed: '#c8a44f',

        border: 'rgba(216, 179, 106, 0.45)',
        borderCheckbox: '#C8B79D',

        transparentPressed: 'rgba(216, 179, 106, 0.18)',
        transparentHover: 'rgba(216, 179, 106, 0.12)',

        bgQuestions: 'rgba(216, 179, 106, 0.08)',

        text: '#ffffff',
        error: '#CB3D3D',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar')],
};

export default config;
