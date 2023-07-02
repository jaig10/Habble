/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        grey: "#444350",
        lightgrey: "#ffffff66",
        bluish: "#00E0FF",
        creme:'#F9F6F2',
        lightergrey: "rgba(206, 206, 206, 0.7)",
        darkpurple: "#933FFF",
        lightpink: "#FFF1F1B2",
        indigoish: "#5F68B6"
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
};
