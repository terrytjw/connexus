/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-once": "bounce 2s ease-in-out 1",
      },
      colors: {
        "red-100": "FFEFF2",
        "red-500": "#FF5B57",
        "orange-300": "#FFD086",
        "teal-100": "#F0FDF4",
        "teal-500": "#67BD8B",
        "sky-100": "#F9FBFF",
        "sky-300": "#87DBFF",
        "blue-600": "#1A7DFF",
        "gray-700": "#616B79",
        "gray-900": "#34383F",
        "neutral-50": "#FFFFFF",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-debug-screens")],
};
