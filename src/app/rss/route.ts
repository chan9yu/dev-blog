import { siteMetadata } from "@/shared/config/site";
import { escapeXml } from "@/shared/utils/xmlEscape";

export function GET() {
	// M5에서 최신 50편 포스트 + content:encoded 통합 예정. 현재는 빈 채널.
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.title)}</title>
    <link>${escapeXml(siteMetadata.url)}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${siteMetadata.locale.replace("_", "-")}</language>
    <atom:link href="${escapeXml(siteMetadata.url)}/rss" rel="self" type="application/rss+xml" />
  </channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=UTF-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate"
		}
	});
}
