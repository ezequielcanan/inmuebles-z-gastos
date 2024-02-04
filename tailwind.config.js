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
        third: "#ffd105",
        fourth: "#f96e1b",
        fifth: "#fed7aa",
        success: "#149c0c",
        secondaryShade: "#aa8616",
        white: "#fff",
        textColor: "#000"
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "Arial"]
      }
    },
  },
  plugins: [],
}

