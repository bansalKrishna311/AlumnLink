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
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      },                    
      colors: {
        primary: '#3f0a40',  // Replacing primary with your color code
        secondary: '#330044', // Replacing secondary with your color code
        started:'#6b21a8',
       
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
