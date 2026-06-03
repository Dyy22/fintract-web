export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-hover": "6px 6px 0px 0px rgba(0, 0, 0, 1)",
      },
      colors: {
        brutal: {
          bg: "#f0f0f0",
          surface: "#ffffff",
          border: "#000000",
          text: "#000000",
          muted: "#555555",
          accent: "#2563eb",
          "accent-hover": "#1d4ed8",
          red: "#dc2626",
          green: "#16a34a",
          yellow: "#eab308",
          "dark-bg": "#1a1a2e",
          "dark-surface": "#16213e",
          "dark-border": "#0f3460",
          "dark-text": "#e0e0e0",
          "dark-muted": "#a0a0a0",
        },
      },
      borderRadius: {
        brutal: "0px",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
