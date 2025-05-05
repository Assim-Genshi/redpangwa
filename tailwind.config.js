const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#A7F25C",
        },
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          layout: {},
          colors: {
            "base-100": "#FFFFFF",    
            "base-200": "#F5F5F5",
            "base-300": "#E5E5E5",    
            "base-content": "#1F2937",
            "accent": "#A7F25C"
          }
        },
        dark: {
          layout: {},
          colors: {
            "base-100": "#1F1F1D", 
            "base-200": "#323431", 
            "base-300": "#404040", 
            "base-content": "#E5E7EB", 
            "accent": "#A7F25C"
          }
        },
        // Add custom themes here
      }
    })
  ]
};
