import { getAllPosts } from "@/features/blog";
import { SITE } from "@/shared/config";
import { baseUrl } from "@/shared/constants";

export async function GET() {
	const allBlogs = await getAllPosts();

	const itemsXml = allBlogs
		.sort((a, b) => {
			if (new Date(a.date) > new Date(b.date)) {
				return -1;
			}
			return 1;
		})
		.map(
			(post) =>
				`<item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/posts/${post.slug}</link>
          <guid isPermaLink="true">${baseUrl}/posts/${post.slug}</guid>
          <description><![CDATA[${post.description || ""}]]></description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <author>${SITE.author.email} (${SITE.author.name})</author>
          ${post.tags?.map((tag) => `<category><![CDATA[${tag}]]></category>`).join("\n          ") || ""}
        </item>`
		)
		.join("\n");

	const rssFeed = /* XML */ `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[${SITE.title}]]></title>
        <link>${baseUrl}</link>
        <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
        <description><![CDATA[${SITE.description}]]></description>
        <language>${SITE.language}</language>
        <copyright>Copyright ${new Date().getFullYear()} ${SITE.author.name}</copyright>
        <managingEditor>${SITE.author.email} (${SITE.author.name})</managingEditor>
        <webMaster>${SITE.author.email} (${SITE.author.name})</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <image>
          <url>${baseUrl}${SITE.logo}</url>
          <title><![CDATA[${SITE.title}]]></title>
          <link>${baseUrl}</link>
        </image>
        ${itemsXml}
    </channel>
  </rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "text/xml"
		}
	});
}
