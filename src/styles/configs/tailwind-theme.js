// this is a js file cause tailwind config file (tailwind.config.js) only supports js
//
// Palette sampled from the studio video behind the landing page: near-black
// cold steel (hue 190-210), a white-cyan neon ring for highlights, and a faint
// green on the bike's trellis frame that we reserve for "verified" states.
export const COLORS = {
  inherit: "inherit",
  transparent: "transparent",
  current: "currentColor",
  white: "#FFF",
  black: "#000",

  /** Page backgrounds: the deepest shadows in the footage. */
  abyss: {
    900: "#0B141A",
    950: "#070D12",
  },
  /** Surfaces, borders and muted text: the lit steel bodywork. */
  steel: {
    300: "#8FA6B0",
    400: "#607E89",
    500: "#305060",
    600: "#253C43",
    700: "#182838",
    800: "#102028",
  },
  /** Body text: the haze around the lamp. */
  mist: {
    100: "#C8D8E0",
    200: "#A1BCC5",
  },
  /** Headings and the ring core. */
  glow: {
    50: "#E8F0F8",
  },
  /** Primary accent: the neon ring. */
  neon: {
    300: "#A6E3F2",
    400: "#7FD3E8",
    500: "#4FBFDC",
  },
  /** Verified / success only: the trellis frame green. */
  trellis: {
    400: "#3DDC84",
    900: "#104028",
  },

  gray: {
    50: "#FAFAFA",
    100: "#f5f5f5",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    950: "#0B0B0B",
  },
  red: {
    50: "#FFEBEE",
    100: "#FFCDD2",
    200: "#EF9A9A",
    300: "#E57373",
    400: "#EF5350",
    500: "#F44336",
    600: "#E53935",
    700: "#D32F2F",
    800: "#C62828",
    900: "#B71C1C",
  },
  gold: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Semantic sets consumed by _colors.scss. The app is dark-only, so both
  // keys resolve to the same video palette.
  light: {
    background: "#070D12",
    divider: "#253C43",
    card: { header: "#182838", body: "#102028" },
    primary: { light: "#A6E3F2", main: "#7FD3E8", dark: "#4FBFDC" },
    secondary: { light: "#8FA6B0", main: "#607E89", dark: "#305060" },
    info: {
      light: "#A6E3F2",
      main: "#7FD3E8",
      dark: "#4FBFDC",
      shade30: "#A6E3F2",
      shade900: "#102028",
    },
    success: { light: "#3DDC84", main: "#3DDC84", dark: "#104028" },
    warning: { light: "#FCD34D", main: "#FBBF24", dark: "#D97706" },
    error: { light: "#EF5350", main: "#F44336", dark: "#D32F2F" },
    other: { outlineBordered: "#253C43" },
  },
  dark: {
    background: "#070D12",
    divider: "#253C43",
    card: { header: "#182838", body: "#102028" },
    action: { active: "#E8F0F8", disabled: "#607E89", selected: "#182838" },
    text: { disabled: "#607E89" },
    primary: { light: "#A6E3F2", main: "#7FD3E8", dark: "#4FBFDC" },
    secondary: { light: "#8FA6B0", main: "#607E89", dark: "#305060" },
    info: { light: "#A6E3F2", main: "#7FD3E8", dark: "#4FBFDC" },
    success: { light: "#3DDC84", main: "#3DDC84", dark: "#104028" },
    warning: { light: "#FCD34D", main: "#FBBF24", dark: "#D97706" },
    error: { light: "#EF5350", main: "#F44336", dark: "#D32F2F" },
    other: { outlineBordered: "#253C43" },
  },
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "1px",
  DEFAULT: "2px",
  mid: "4px",
  lmid: "6px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "1000rem",
};

export const BOX_SHADOW = {
  none: "none",
  sm: "0 1px 2px rgb(0 0 0 / 40%)",
  DEFAULT: "0 4px 12px rgb(0 0 0 / 45%)",
  lg: "0 12px 32px rgb(0 0 0 / 55%)",
  /** Neon ring glow for primary actions. */
  glow: "0 0 0 1px rgb(127 211 232 / 35%), 0 0 24px rgb(127 211 232 / 30%)",
  "glow-lg":
    "0 0 0 1px rgb(127 211 232 / 45%), 0 0 48px rgb(127 211 232 / 40%)",
};

export const BREAKPOINTS = {
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
};
