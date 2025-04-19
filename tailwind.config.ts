import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F2D675",
          dark: "#AA8C2C",
        },
        deepRed: {
          DEFAULT: "#8B0000",
          light: "#B22222",
          dark: "#640000",
        },
        neonGreen: {
          DEFAULT: "#39FF14",
          muted: "rgba(57, 255, 20, 0.7)",
        },
        neonPurple: {
          DEFAULT: "#BC13FE",
          muted: "rgba(188, 19, 254, 0.7)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-bebas-neue)", "sans-serif"],
        graffiti: ["var(--font-permanent-marker)", "cursive"],
        accent: ["var(--font-teko)", "sans-serif"],
      },
      backgroundImage: {
        "urban-pattern": "url('/patterns/urban-pattern.png')",
        "gold-texture": "url('/patterns/gold-texture.png')",
        "graffiti-wall": "url('/patterns/graffiti-wall.jpg')",
        concrete: "url('/patterns/concrete-texture.jpg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
