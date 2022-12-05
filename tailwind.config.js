/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

const textShadowPlugin = plugin(
  function ({ addUtilities, e, theme, variants }) {
    const textShadow = theme("textShadow", {});

    const textShadowVariants = variants("textShadow", []);

    const utilities = {};
    Object.keys(textShadow).forEach((key) => {
      const val = textShadow[key];
      const className =
        key === "default" ? "text-shadow" : `${e(`text-shadow-${key}`)}`;
      utilities[`.${className}`] = { "text-shadow": val };
    });

    addUtilities(utilities, textShadowVariants);
  },
  {
    theme: {
      textShadow: {
        default: "0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)",
        sm: "1px 1px 3px rgb(36 37 47 / 25%)",
        md: "0px 1px 2px rgb(30 29 39 / 19%), 1px 2px 4px rgb(54 64 147 / 18%)",
        de: "2px 2px 2px #ccc",
        lg: "2px 2px 2px #2e2e2e",
        xl: "1px 1px 3px rgb(0 0 0 / 29%), 2px 4px 7px rgb(73 64 125 / 35%)",
        none: "none",
      },
    },
    variants: {
      textShadow: ["responsive", "hover", "focus"],
    },
  }
);

module.exports = {
  content: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    extend: {
      backgroundColor: {
        black: "#2e2e2e",
      },
      colors: {
        "accent-1": "#FAFAFA",
        "accent-2": "#EAEAEA",
        "accent-7": "#333",
        success: "#0070f3",
        cyan: "#79FFE1",
        black: "#2e2e2e",
        indigo: "#d1ff29",
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      borderColor: {
        indigo: "#d1ff29",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
        lg: "2px 2px 3px #2e2e2e",
      },
    },
  },
  plugins: [textShadowPlugin],
};
