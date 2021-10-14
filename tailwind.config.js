module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  important: true,
  variants: {
    extend: {
      borderRadius: ['hover'],
      width: ['hover', 'focus'],
      position: ['hover', 'focus'],
    },
  },
  plugins: [],
};
