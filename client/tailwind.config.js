/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3f0a40',  // Replacing primary with your color code
        secondary: '#6a246a', // Replacing secondary with your color code
        started:'#aa51aa',
       
        accent: '#FFD600',    // Replacing accent with your color code
        lightBlue: '#90CAF9', // Adding light blue
        lightPurple: '#B39DDB', // Adding light purple
      },
    },
  },
  darkMode: 'class', 
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      'light',    
      'dark',     
    ],
  },
};
