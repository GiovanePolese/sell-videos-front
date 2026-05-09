import type { Config } from 'tailwindcss';

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          500: '#4f46e5',
          700: '#3730a3'
        }
      }
    }
  },
  plugins: []
};

export default preset;
