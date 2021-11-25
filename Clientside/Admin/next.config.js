/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: true,
	images: {
		domains: ["assets.adidas.com", "s.gravatar.com"],
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard",
				permanent: true,
			},
			{
				source: "/index",
				destination: "/dashboard",
				permanent: true,
			},
		];
	},
};
