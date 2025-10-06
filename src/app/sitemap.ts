import type { MetadataRoute } from "next";

import { getAllPosts } from "@/features/blog";
import { getAllSeries } from "@/features/series";
import { getTagCounts } from "@/features/tags";
import { baseUrl } from "@/shared/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();
	const blogs = posts.map((post) => ({
		url: `${baseUrl}/posts/${post.url_slug}`,
		lastModified: post.updated_at
	}));

	const series = await getAllSeries();
	const seriesPages = series.map((s) => ({
		url: `${baseUrl}/series/${s.url_slug}`,
		lastModified: s.updated_at
	}));

	const tagCounts = await getTagCounts();
	const tagPages = Object.keys(tagCounts).map((tag) => ({
		url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
		lastModified: new Date().toISOString().split("T")[0]
	}));

	const routes = ["", "/posts", "/series", "/tags"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0]
	}));

	return [...routes, ...blogs, ...seriesPages, ...tagPages];
}
