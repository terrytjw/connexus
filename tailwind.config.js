/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#1A7DFF",
        },
      },
    ],
  },
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
        "red-100": "#FFEFF2",
        "red-500": "#FF5B57",
        "orange-300": "#FFD086",
        "teal-100": "#F0FDF4",
        "teal-500": "#67BD8B",
        "sky-100": "#F9FBFF",
        "sky-300": "#87DBFF",
        "blue-100": "#E4F5FF", // use for outlined button hover state bg color
        "blue-600": "#1A7DFF",
        "blue-900": "#1A54C2", // use for solid button hover state bg color
        "gray-200": "#F2F3F8",
        "gray-700": "#616B79",
        "gray-900": "#34383F",
        "neutral-50": "#FFFFFF",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-debug-screens")],
};
