import type { Config } from 'tailwindcss';
import preset from '@sell-videos/config/tailwind/preset';

const config: Config = {
  presets: [preset as Config],
  content: ['./src/**/*.{js,ts,jsx,tsx}']
};

export default config;
