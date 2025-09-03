/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        highlightYellow: '#fef08a',
        highlightBlue: '#bfdbfe',
        highlightGreen: '#bbf7d0',
        highlightPink: '#f9a8d4',
        highlightPurple: '#ddd6fe',
      },
    },
  },
  plugins: [],
};
