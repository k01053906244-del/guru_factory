/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface": "#fcf9f8",
        "on-secondary": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-bright": "#fcf9f8",
        "inverse-on-surface": "#f3f0ef",
        "on-tertiary-fixed": "#002111",
        "on-secondary-fixed": "#380d00",
        "tertiary-container": "#00472b",
        "on-tertiary": "#ffffff",
        "on-primary-container": "#bc95ff",
        "on-secondary-container": "#571a00",
        "surface-dim": "#dcd9d9",
        "on-tertiary-fixed-variant": "#005232",
        "on-error-container": "#93000a",
        "primary-container": "#4f1d96",
        "on-primary": "#ffffff",
        "tertiary-fixed": "#78fbb6",
        "inverse-surface": "#313030",
        "surface-container-lowest": "#ffffff",
        "secondary": "#a83900",
        "on-tertiary-container": "#33be7f",
        "secondary-container": "#ff641d",
        "on-secondary-fixed-variant": "#802a00",
        "outline-variant": "#ccc3d4",
        "secondary-fixed": "#ffdbce",
        "outline": "#7b7483",
        "error-container": "#ffdad6",
        "background": "#fcf9f8",
        "secondary-fixed-dim": "#ffb59a",
        "error": "#ba1a1a",
        "surface-tint": "#7145b9",
        "on-error": "#ffffff",
        "primary-fixed-dim": "#d5bbff",
        "tertiary-fixed-dim": "#59de9b",
        "on-primary-fixed": "#270057",
        "surface-container-high": "#eae7e7",
        "on-background": "#1c1b1b",
        "on-surface": "#1c1b1b",
        "inverse-primary": "#d5bbff",
        "primary-fixed": "#ecdcff",
        "tertiary": "#002e1a",
        "primary": "#370076",
        "on-surface-variant": "#4a4452",
        "surface-container": "#f0eded",
        "surface-container-highest": "#e5e2e1",
        "on-primary-fixed-variant": "#5929a0",
        "surface-variant": "#e5e2e1"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "card-padding": "24px",
        "section-padding": "40px",
        "gutter": "16px",
        "base": "8px",
        "container-margin": "24px"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Hanken Grotesk", "sans-serif"]
      }
    },
  },
  plugins: [],
}
