/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        floatDiagonal: {
          "0%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(20px, -20px)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        rotateSlow: "rotateSlow 30s linear infinite",
        floatDiagonal: "floatDiagonal 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
