/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src//*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5E35B1',  // Replacing primary with your color code
        secondary: '#2196F3', // Replacing secondary with your color code
        accent: '#FFD600',    // Replacing accent with your color code
        lightBlue: '#90CAF9', // Adding light blue
        lightPurple: '#B39DDB', // Adding light purple
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      'light', 
    ],
  },
};