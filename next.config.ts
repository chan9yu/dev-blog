import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// `cacheComponents: true`(Next.js 16 PPR)는 RSC를 default dynamic으로 만들어 매 요청 fs.readdirSync(contents/)를
	// 호출 → Vercel lambda에 contents/ 부재 시 ENOENT throw → 모든 dynamic 페이지 streaming stuck (v1.1.0 incident).
	// 이 프로젝트는 SSG-first(PRD G-1)이며 ISR/dynamic이 필요한 페이지가 없으므로 PPR 의미 없음. 비활성화 → Next.js 기본
	// `next build` 시점에 모든 페이지 정적 prerender → runtime contents/ 의존 0% (v1.1.2 fix).
	cacheComponents: false,
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
