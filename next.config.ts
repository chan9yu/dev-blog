import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	poweredByHeader: false,
	images: {
		formats: ["image/avif", "image/webp"]
	},
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "chan9yu.dev"
					}
				],
				destination: "https://www.chan9yu.dev/:path*",
				permanent: true
			}
		];
	},
	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js"
			}
		}
	}
};

export default nextConfig;
