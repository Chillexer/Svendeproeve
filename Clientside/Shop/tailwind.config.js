module.exports = {
	mode: "jit",
	purge: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'red-500': '#D8414A',
				'red-600': '#9C2828',
				'beige': '#BDB7A6',
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
