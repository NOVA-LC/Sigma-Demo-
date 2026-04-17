import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-navy": "#001F33",
        "secondary-dark": "#142A3A",
        "accent-blue": "#0099FF",
        "light-gray": "#C6DAED",
      },
      fontFamily: {
        heading: ["Inter", "system-ui", "sans-serif"],
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
