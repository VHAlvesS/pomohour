/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: "#1C1C1C",
      },
      boxShadow: {
        "custom-buttonShadow": "0 0px 0px 1px rgba(227, 227, 227, 0.1)",
      },
    },
  },
  plugins: [],
};
