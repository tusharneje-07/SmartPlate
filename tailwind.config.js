/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./templates/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        bgsecDark: '#545454',
        bgsecLight: '#DBDBDB',
        borderLight: '#d1d5db',
        borderDark: '#4b5563',
        logBut: '#f87171',
        hoverlogBut: '#ef4444',
        backgroundLight: '#FAFCFE',
        backgroundDark: '#2F2F2F',
        secbackgroundLight: '#DBDBDB',
        secbackgroundDark: '#545454',
        textPrimaryLight: '#181818',
        textPrimaryDark: '#FFFFFF',
        accent: '#3EB075',
        accenthover: '#69B075',
        btnTextLight: '#181818',
        btnTextDark: '#FFFFFF'
      },
      fontFamily:{
        lato: ['Lato', 'sans-serif'],
      }
    },
    plugins: [],
  }
}
