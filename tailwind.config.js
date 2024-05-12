import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          ['InterVariable', ...defaultTheme.fontFamily.sans],
          {
            fontFeatureSettings: '"liga", "calt", "dlig", "ss02", "ss03"',
            fontVariationSettings: '"opsz" 32',
          },
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),

    plugin(({ addUtilities, theme, e }) => {
      const newUtilities = {};
      const shorthand = {
        'marginBlockStart': 'mbs',
        'marginBlockEnd': 'mbe',
        'paddingBlockStart': 'pbs',
        'paddingBlockEnd': 'pbe',
      };

      Object.keys(shorthand).forEach(key => {
        const sizeVariants = theme('spacing');
        for (let size in sizeVariants) {
          newUtilities[`.${e(`${shorthand[key]}-${size}`)}`] = {
            [key]: sizeVariants[size],
          };
        }
      });

      addUtilities(newUtilities, ['responsive', 'hover']);
    }),
  ],
};
