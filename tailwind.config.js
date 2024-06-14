/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      container: {
         padding: {
            DEFAULT: "10px",
            md: "0",
         },
      },
      extend: {},
   },
   plugins: [],
};
