/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PortSync Design System Colors
        "port-navy": "#0B1F33",
        "port-blue": "#2D5BFF",
        "port-blue-light": "#EEF2FF",
        "port-green": "#27AE60",
        "port-orange": "#F5A623",
        "port-red": "#E74C3C",
        
        // Surfaces
        background: "#F7F9FC",
        surface: "#FFFFFF",
        "surface-dim": "#D8DADD",
        "surface-container": "#ECEEF1",
        "surface-container-low": "#F2F4F7",
        "surface-container-high": "#E6E8EB",
        "surface-variant": "#E0E3E6",
        
        // Text
        "on-surface": "#191C1E",
        "on-surface-variant": "#44474C",
        
        // Borders
        "outline": "#74777D",
        "outline-variant": "#C4C6CD",
        
        // Primary (Deep Navy)
        "primary": "#0B1F33",
        "primary-container": "#002147",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#7587A0",
        
        // Secondary (Port Blue)
        "secondary": "#2D5BFF",
        "secondary-container": "#EEF2FF",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#001355",
        
        // Semantic
        "success": "#27AE60",
        "success-container": "#D1FAE5",
        "warning": "#F5A623",
        "warning-container": "#FEF3C7",
        "error": "#E74C3C",
        "error-container": "#FEE2E2",
        "on-error": "#FFFFFF",
        
        // Tertiary (teal for charts/accents)
        "tertiary": "#009A50",
        "tertiary-container": "#D1FAE5",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["32px", { lineHeight: "40px", fontWeight: "700", letterSpacing: "-0.02em" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600", letterSpacing: "-0.01em" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "title-lg": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", fontWeight: "600", letterSpacing: "0.02em" }],
        "label-sm": ["11px", { lineHeight: "14px", fontWeight: "500" }],
        "data": ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        card: "0px 4px 12px rgba(0, 33, 71, 0.05)",
        modal: "0px 12px 24px rgba(0, 0, 0, 0.10)",
        "card-hover": "0px 8px 24px rgba(0, 33, 71, 0.10)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-8px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
