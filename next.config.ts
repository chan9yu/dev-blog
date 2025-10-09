import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/chan9yu/blog9yu-content/**"
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/u/**"
			},
			// 임시 설정
			{
				protocol: "https",
				hostname: "velog.velcdn.com",
				pathname: "/images/chan9yu/post/**"
			}
		]
	}
};

export default nextConfig;
