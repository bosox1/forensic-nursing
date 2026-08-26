/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#3D4751",
        slate2: "#2C333A",
        blue: { DEFAULT: "#6FB3D6", dark: "#4E8FB5" },
        paper: "#F5F6F7",
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
