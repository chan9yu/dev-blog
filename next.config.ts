import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	reactCompiler: true,
	poweredByHeader: false,
	images: {
		formats: ["image/avif", "image/webp"]
	},
	// Vercel Function 사이즈 한계(300MB) 대응. file-tracing이 RSC의 fs.readFileSync 경로를
	// 따라가 contents/ 전체(157MB)를 lambda에 포함시켜 310MB로 부풀던 회귀 차단.
	// MDX는 빌드 타임에 모두 정적 페이지로 prerender되므로 런타임에 contents/ 접근 없음.
	// public/posts/는 Next.js가 자동으로 lambda 외부로 분리하지만 명시해 안전판 강화.
	outputFileTracingExcludes: {
		"*": ["contents/**/*", "public/posts/**/*", "node_modules/@swc/**/*", "node_modules/.pnpm/typescript*/**/*"]
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
