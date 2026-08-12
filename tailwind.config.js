/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	plugins: [],
	theme: {
		extend: {
			height: {
				// 写法1：直接字符串写px ✅
				header: "64px",
			},
		},
	},
};
