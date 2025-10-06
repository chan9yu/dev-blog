import type { MetadataRoute } from "next";

import { baseUrl } from "@/shared/constants";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [{ userAgent: "*" }],
		sitemap: `${baseUrl}/sitemap.xml`
	};
}
