/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f5401c",
        secondary: "#ff9b18",
        third: "#f0cd22",
        fourth: "#f96e1b",
        secondaryShade: "#aa8616",
        white: "#fff",
        textColor: "#000"
      }
    },
  },
  plugins: [],
}

