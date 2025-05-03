/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#7C3AED',
					dark: '#5B21B6',
				},
			},
			fontFamily: {
				sans: ['Inter var', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
}