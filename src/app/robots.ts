import { siteMetadata } from "@/shared/config/site";

export default function robots() {
	const isProduction = process.env.VERCEL_ENV === "production";

	// preview/local: 색인 전체 차단. sitemap도 omit해서 검색엔진이 preview URL 크롤 안 하도록.
	if (!isProduction) {
		return {
			rules: { userAgent: "*", disallow: "/" }
		};
	}

	return {
		rules: { userAgent: "*", allow: "/", disallow: "/api/" },
		sitemap: `${siteMetadata.url}/sitemap.xml`
	};
}
