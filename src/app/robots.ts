import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/shared/config/site";

/**
 * robots.txt 생성기.
 *
 * - production: `/*` allow, `/api/` 차단, sitemap URL 명시
 * - preview/local (VERCEL_ENV !== "production"): 색인 전체 차단, sitemap omit
 *
 * Private 포스트 URL은 sitemap에서 자체 제외되므로 robots에 별도 Disallow가 불필요
 * (PRD §10.6). 검색엔진은 sitemap 미등록 URL을 발견할 가능성이 낮다.
 */
export default function robots(): MetadataRoute.Robots {
	const isProduction = process.env.VERCEL_ENV === "production";

	if (!isProduction) {
		return {
			rules: { userAgent: "*", disallow: "/" }
		};
	}

	return {
		rules: { userAgent: "*", allow: "/", disallow: "/api/" },
		sitemap: `${getSiteUrl()}/sitemap.xml`
	};
}
