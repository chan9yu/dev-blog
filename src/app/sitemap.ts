import type { MetadataRoute } from "next";

import { getAllPosts } from "@/features/blog";
import { baseUrl } from "@/shared/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();
	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.url_slug}`,
		lastModified: post.updated_at
	}));

	const routes = ["", "/blog"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0]
	}));

	return [...routes, ...blogs];
}
