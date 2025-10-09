import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/chan9yu/blog9yu-content/**"
			}
		]
	}
};

export default nextConfig;
