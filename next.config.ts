import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**"
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**"
			}
		]
	},
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"]
};

const withMDX = createMDX({
	// Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
