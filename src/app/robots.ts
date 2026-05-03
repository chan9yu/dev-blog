import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/shared/config/site";

// preview/local 환경은 색인 전체 차단 — production만 sitemap 노출.
// Private URL은 sitemap에서 자체 제외되므로 별도 Disallow 불필요 (PRD §10.6).
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
