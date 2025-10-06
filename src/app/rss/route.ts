import { getAllPosts } from "@/features/blog";
import { baseUrl } from "@/shared/constants";

export async function GET() {
	const allBlogs = await getAllPosts();

	const itemsXml = allBlogs
		.sort((a, b) => {
			if (new Date(a.released_at) > new Date(b.released_at)) {
				return -1;
			}
			return 1;
		})
		.map(
			(post) =>
				`<item>
          <title>${post.title}</title>
          <link>${baseUrl}/posts/${post.url_slug}</link>
          <description>${post.short_description || ""}</description>
          <pubDate>${new Date(post.released_at).toUTCString()}</pubDate>
        </item>`
		)
		.join("\n");

	const rssFeed = /* XML */ `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>My Portfolio</title>
        <link>${baseUrl}</link>
        <description>This is my portfolio RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "text/xml"
		}
	});
}
