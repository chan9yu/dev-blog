import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: true,
	poweredByHeader: false,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }]
	},
	// Vercel Function 사이즈 한계(300MB) 대응. contents/ 157MB 중 155MB는 images, 576KB만 MDX 텍스트.
	// `app/layout.tsx`의 `getPublicPosts()`가 매 요청마다 `readdirSync(contents/posts)` + `readFileSync(*.mdx)`를
	// 호출하므로 MDX 텍스트는 lambda에 반드시 포함되어야 함 (cacheComponents 캐시 만료 시 runtime fallback).
	// 따라서 images만 exclude로 빼고, MDX는 explicit include로 안전판 강화 (readdirSync는 dynamic fs라 trace heuristic이 자식 파일을 자동 포함하지 못함).
	outputFileTracingIncludes: {
		"*": ["contents/posts/**/*.mdx", "contents/posts/**/*.md", "contents/about/**/*"]
	},
	outputFileTracingExcludes: {
		"*": ["contents/**/images/**", "public/posts/**/*", "node_modules/@swc/**/*", "node_modules/.pnpm/typescript*/**/*"]
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
