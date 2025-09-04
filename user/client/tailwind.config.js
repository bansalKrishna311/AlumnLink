import daisyui from "daisyui";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            colors: {
                primary: '#fe6019',
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [
        daisyui, 
        tailwindcssAnimate,
        function({ addUtilities }) {
            addUtilities({
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
                '.line-clamp-3': {
                    overflow: 'hidden',
                    display: '-webkit-box',
                    '-webkit-box-orient': 'vertical',
                    '-webkit-line-clamp': '3',
                },
            });
        },
    ],
    daisyui: {
        themes: [
            {
                AlumnLink: {
                    primary: "#fe6019", // AlumnLink Orange
                    secondary: "#FFFFFF", // White
                    accent: "#fd8e5e", // Lighter orange for accents
                    neutral: "#000000", // Black (for text)
                    "base-100": "#F3F2EF", // Light Gray (background)
                    info: "#5E5E5E", // Dark Gray (for secondary text)
                    success: "#057642", // Dark Green (for success messages)
                    warning: "#F5C75D", // Yellow (for warnings)
                    error: "#CC1016", // Red (for errors)
                },
            },
        ],
    },
};
