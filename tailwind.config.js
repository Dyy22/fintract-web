export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        base: "0px",
      },
      boxShadow: {
        shadow: "4px 4px 0px 0px rgba(0,0,0,1)",
        "shadow-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
      },
      translate: {
        boxShadowX: "4px",
        boxShadowY: "4px",
      },
      colors: {
        background: "var(--background)",
        "secondary-background": "var(--secondary-background)",
        foreground: "var(--foreground)",
        "main-foreground": "var(--main-foreground)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
