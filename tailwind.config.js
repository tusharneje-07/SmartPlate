/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
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
