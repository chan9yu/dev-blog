import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: false,
	reactCompiler: true,
	poweredByHeader: false,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }]
	},
	// contents/posts/*/images/는 빌드 타임에 public/posts/로 copy되므로 lambda에서 read 안 함.
	// Next.js 16 auto-trace가 sibling images까지 over-include하는 경향이 있어 명시적 제외로 lambda payload 절감(155MB).
	outputFileTracingExcludes: {
		"*": ["contents/**/images/**"]
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
