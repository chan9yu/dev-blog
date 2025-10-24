import type { MetadataRoute } from "next";

import { baseUrl } from "@/shared/constants";

export default function robots(): MetadataRoute.Robots {
	const IS_PROD = process.env.VERCEL_ENV === "production";

	// 프로덕션: 모든 크롤러 허용, 불필요한 경로 차단
	// 개발/프리뷰: 모든 크롤링 차단
	if (IS_PROD) {
		return {
			rules: [
				{
					userAgent: "*",
					allow: "/",
					disallow: [
						"/_next/static/", // Next.js 정적 빌드 파일
						"/_next/image/", // Next.js 이미지 최적화 API
						"/api/" // API 라우트 (있다면)
					]
				}
			],
			sitemap: `${baseUrl}/sitemap.xml`
		};
	}

	// 개발/프리뷰 환경: 모든 크롤링 차단
	return {
		rules: [
			{
				userAgent: "*",
				disallow: "/"
			}
		]
	};
}
