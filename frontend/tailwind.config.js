/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0D1117',
        secondary: '#161B22',
        accent: '#238636',
        highlight: '#30363D',
        light: '#C9D1D9',
        'light-accent': '#8B949E',
        blue: '#58A6FF',
        green: '#3FB950',
        red: '#F85149'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        slideInUp: 'slideInUp 0.5s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
