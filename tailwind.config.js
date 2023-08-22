const colors = require('tailwindcss/colors');

/** @type import('tailwindcss').Config */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './libs/components/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    function ({ addVariant }) {
      // https://github.com/tailwindlabs/tailwindcss.com/blob/master/tailwind.config.js#L276
      addVariant('supports-scrollbars', '@supports selector(::-webkit-scrollbar)');
      addVariant('scrollbar', '&::-webkit-scrollbar');
      addVariant('scrollbar-track', '&::-webkit-scrollbar-track');
      addVariant('scrollbar-thumb', '&::-webkit-scrollbar-thumb');
    }
  ]
};
