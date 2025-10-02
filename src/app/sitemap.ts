import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";

export const baseUrl = "https://portfolio-blog-starter.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getBlogPosts();
	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.metadata.publishedAt
	}));

	const routes = ["", "/blog"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0]
	}));

	return [...routes, ...blogs];
}
