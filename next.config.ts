import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
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
	},
	webpack(config) {
		// SVG를 React 컴포넌트로 import 가능하도록 설정
		config.module.rules.push({
			test: /\.svg$/i,
			use: ["@svgr/webpack"]
		});

		return config;
	}
};

export default nextConfig;
