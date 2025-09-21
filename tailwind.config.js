const animate = require("tailwindcss-animate");
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,vue}",
    "./components/**/*.{ts,tsx,vue}",
    "./app/**/*.{ts,tsx,vue}",
    "./src/**/*.{ts,tsx,vue}",
  ],
  important: true, // Makes all utility classes important
  prefix: "",
  theme: {
    extend: {},
  },
  plugins: [animate, require("tailwindcss-animate")],
};
