const colors = require("tailwindcss/colors");
delete colors.lightBlue;

module.exports = {
	mode: "jit",
	purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		colors: {
			...colors,
		},
	},
	variants: {
		extend: {},
	},
	plugins: [require("tailwind-scrollbar")],
};
