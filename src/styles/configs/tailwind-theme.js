// this is a js file cause tailwind config file (tailwind.config.js) only supports js
export const COLORS = {
  inherit: "inherit",
  transparent: "transparent",
  current: "currentColor",
  white: "#FFF",
  black: "#000",
  gray: {
    50: "#FAFAFA",
    100: "#f5f5f5",
    125: "#D9D9D9",
    150: "#27272a",
    200: "#EEEEEE",
    300: "#E0E0E0",
    400: "#BDBDBD",
    500: "#9E9E9E",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    850: "#1b1b1e",
    900: "#212121",
    950: "#0B0B0B",
    960: "#1E1E1E",
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
  blue: {
    50: "#E3F2FD",
    100: "#BBDEFB",
    200: "#90CAF9",
    300: "#64B5F6",
    400: "#42A5F5",
    500: "#2196F3",
    600: "#1E88E5",
    700: "#1976D2",
    800: "#1565C0",
    900: "#0D47A1",
  },
  // Complete green palette for 3rdstage branding
  green: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  },
  // Financial-themed colors
  emerald: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
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
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  light: {
    background: "#FFFFFF",
    divider: "#E5E7EB",
    card: {
      header: "#FAFAFA",
      body: "#FFF",
    },
    primary: {
      light: "#DCFCE7",
      main: "#16A34A",
      dark: "#15803D",
    },
    secondary: {
      light: "#F1F5F9",
      main: "#64748B",
      dark: "#334155",
    },
    info: {
      light: "#DBEAFE",
      main: "#3B82F6",
      dark: "#1D4ED8",
      shade30: "#93C5FD",
      shade900: "#1E3A8A",
    },
    success: {
      light: "#DCFCE7",
      main: "#16A34A",
      dark: "#15803D",
    },
    warning: {
      light: "#FEF3C7",
      main: "#F59E0B",
      dark: "#D97706",
    },
    error: {
      light: "#FEE2E2",
      main: "#EF4444",
      dark: "#DC2626",
    },
    other: {
      outlineBordered: "#E5E7EB",
    },
  },
  dark: {
    background: "#0F172A",
    divider: "#334155",
    card: {
      header: "#1E293B",
      body: "#0F172A",
    },
    action: {
      active: "#F8FAFC",
      disabled: "#64748B",
      selected: "#334155",
    },
    text: {
      disabled: "#94A3B8",
    },
    primary: {
      light: "#86EFAC",
      main: "#22C55E",
      dark: "#16A34A",
    },
    secondary: {
      light: "#CBD5E1",
      main: "#94A3B8",
      dark: "#64748B",
    },
    info: {
      light: "#93C5FD",
      main: "#3B82F6",
      dark: "#1D4ED8",
    },
    success: {
      light: "#86EFAC",
      main: "#22C55E",
      dark: "#16A34A",
    },
    warning: {
      light: "#FCD34D",
      main: "#F59E0B",
      dark: "#D97706",
    },
    error: {
      light: "#F87171",
      main: "#EF4444",
      dark: "#DC2626",
    },
    other: {
      outlineBordered: "#334155",
    },
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
  none: "none", // elevation-0
  sm: "rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px", // elevation-1
  DEFAULT:
    "rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px", // elevation-2
  lg: "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px", // elevation-3
};

export const BREAKPOINTS = {
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
};

// Add font weight configuration
export const FONT_WEIGHT = {
  normal: "400",
  medium: "500",
  bold: "700",
};

// Add font size configuration
export const FONT_SIZE = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
};

// Add line height configuration
export const LINE_HEIGHT = {
  none: "1",
  tight: "1.25",
  normal: "1.5",
  relaxed: "1.75",
  loose: "2",
};
