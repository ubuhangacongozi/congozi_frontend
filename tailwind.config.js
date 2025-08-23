/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      Poppins: "Poppins",
      Paprika: "Paprika",
      Inria: "Inria Serif",
      cardo: ["Cardo", "serif"],
      Roboto: ["Roboto", "sans-serif"],
      SourcePro: ["Source Sans Pro", "sans-serif"],
    },
    extend: {
      colors: {
        Total: "#210D69",
        Tangira: "#68A6E9",
        Unpaid: "#F6BD2E",
        Passed: "#32F63C",
        Default: "#D9D9D9",
        Waiting: "#BFE5F7",
        Expired: "#B3210A",
        Notready: "#F5915A",
      },
      container: {
        center: true,
        padding: {
          default: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
};
