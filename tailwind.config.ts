import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-playfair)", "serif"],
      },
      colors: {
        primary: {
          50: "#f5f5f5",
          100: "#e0e0e0",
          200: "#c0c0c0",
          300: "#9e9e9e",
          400: "#6b6b6b",
          500: "#1a1a1a",
          600: "#151515",
          700: "#101010",
          800: "#0d0d0d",
          900: "#0a0a0a",
          DEFAULT: "#1a1a1a",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          DEFAULT: "#f5f5f5",
          foreground: "#1a1a1a",
        },
        accent: {
          50: "#faf7f2",
          100: "#f5ede0",
          200: "#ead9c1",
          300: "#dec09d",
          400: "#d4a574",
          500: "#c8965f",
          600: "#b8854a",
          700: "#9a6f3d",
          800: "#7c5930",
          900: "#5d4223",
          DEFAULT: "#d4a574",
          foreground: "#ffffff",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.1)",
          card: "rgba(255, 255, 255, 0.7)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-warm": "linear-gradient(135deg, #f5f5f5 0%, #faf7f2 50%, #f5ede0 100%)",
        "gradient-accent": "linear-gradient(135deg, #d4a574 0%, #c8965f 50%, #b8854a 100%)",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 16px 64px 0 rgba(0, 0, 0, 0.15)",
        "soft": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;

