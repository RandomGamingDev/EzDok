/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/*.js", "./pages/js/*.js"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

