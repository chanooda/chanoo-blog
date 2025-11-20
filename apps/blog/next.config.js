/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["ui"],
	output: "standalone",
	turbopack: {
		resolveAlias: {
			"@": "./",
			"@ui": "../../packages/ui/src",
			"@ui/*": "../../packages/ui/src/*",
			ui: "../../packages/ui/src",
			"ui/*": "../../packages/ui/src/*",
		},
	},
};

module.exports = nextConfig;
