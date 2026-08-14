/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	plugins: [],
	theme: {
		extend: {
			height: {
				top: "54px",
			},
			boxShadow: {
				soft: "0 2px 12px 0 rgba(37, 119, 245, 0.08)",
				"soft-lg": "0 8px 30px 0 rgba(37, 119, 245, 0.10)",
			},
		},
	},
};
