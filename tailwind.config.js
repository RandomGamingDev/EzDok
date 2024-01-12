/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/*.js", "./pages/js/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

