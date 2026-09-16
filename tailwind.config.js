/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require("tailwindcss/plugin");

const COLORS = require("./src/styles/configs/tailwind-theme.js").COLORS;
const BORDER_RADIUS =
  require("./src/styles/configs/tailwind-theme.js").BORDER_RADIUS;
const BOX_SHADOW = require("./src/styles/configs/tailwind-theme.js").BOX_SHADOW;
const BREAKPOINTS =
  require("./src/styles/configs/tailwind-theme.js").BREAKPOINTS;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class", "class"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      grotesk: ["grotesk", "sans-serif"],
    },
    container: {
      center: "true",
      padding: {
        DEFAULT: "1rem",
      },
    },
    colors: {
      ...COLORS,
    },
    borderRadius: {
      ...BORDER_RADIUS,
    },
    boxShadow: {
      ...BOX_SHADOW,
    },
    screens: {
      ...BREAKPOINTS,
    },
    extend: {
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700,
      },
      fontSize: {
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        base: "1rem", // 16px
        lg: "1.125rem", // 18px
        xl: "1.25rem", // 20px
        "2xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
        loose: "2",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    }),
    require("tailwindcss-animate"),
  ],
};
