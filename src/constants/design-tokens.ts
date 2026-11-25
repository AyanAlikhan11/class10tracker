export const DESIGN_TOKENS = {
  colors: {
    primary: "#3978E8", // Primary blue
    secondary: "#42B9A5", // Secondary teal
    background: "#F7F9FC", // Soft neutral background
    surface: "#FFFFFF", // Clean card surface
    textMain: "#243247", // Readable navy-charcoal text
    textMuted: "#718096", // Soft subtext
    success: "#37A779", // Fresh green
    warning: "#F2B84B", // Warm amber
    border: "#E2E8F0",
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  radius: {
    card: "16px",
    button: "10px",
    badge: "9999px",
  },
} as const;
