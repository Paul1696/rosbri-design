/**
 * ROSBRI DESIGN - Unified Tailwind CDN Configuration
 * Loaded before Tailwind CDN on all pages to ensure consistent theme tokens.
 */
tailwind = window.tailwind || {};
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "ink": "#1a1c1f",
        "champagne": "#c5a059",
        "champagne-dark": "#9f7c31",
        "cream": "#faf9fe",
        "paper": "#fbf8f2",
        "muted": "#646468",
        "line": "#e3e2e7",
        "error": "#ba1a1a",
        "primary": "#775a19",
        "primary-container": "#c5a059",
        "surface-variant": "#e3e2e7",
        "surface-container-low": "#f4f3f8",
        "background": "#faf9fe",
        "on-surface-variant": "#4e4639",
        "success": "#25d366"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "display-accent": ["Playfair Display", "serif"]
      },
      spacing: {
        "gutter": "24px",
        "stack-sm": "1rem",
        "stack-md": "1.5rem",
        "stack-lg": "2.5rem",
        "margin-lg": "4rem",
        "margin-md": "2rem",
        "xl": "48px",
        "xxl": "80px"
      }
    }
  }
};
