import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#faf7f2', 100: '#f5efe6', 200: '#e8dfd2', 300: '#ddd4c4',
          400: '#c4b8a5', 500: '#a0937e', 600: '#8a7b68', 700: '#8b6f47',
          800: '#6b5c4a', 900: '#5c4a32', 950: '#3d3225'
        }
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Hiragino Sans"', 'sans-serif'],
      },
      keyframes: {
        fu: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fu: 'fu 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }
    },
  },
  plugins: [],
};
export default config;
