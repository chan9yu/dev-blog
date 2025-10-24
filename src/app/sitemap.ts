import type { MetadataRoute } from "next";

import { getAllPosts } from "@/features/blog";
import { getAllSeries } from "@/features/series";
import { getTagCounts } from "@/features/tags";
import { baseUrl } from "@/shared/constants";
import { slugify } from "@/shared/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const currentDate = new Date().toISOString().split("T")[0];

	// 포스트 상세 페이지
	const posts = await getAllPosts();
	const blogs = posts.map((post) => ({
		url: `${baseUrl}/posts/${post.slug}`,
		lastModified: post.date,
		changeFrequency: "weekly" as const,
		priority: 0.8
	}));

	// 시리즈 상세 페이지
	const series = await getAllSeries();
	const seriesPages = series.map((s) => ({
		url: `${baseUrl}/series/${s.slug}`,
		lastModified: s.posts[0]?.date || currentDate,
		changeFrequency: "weekly" as const,
		priority: 0.6
	}));

	// 태그 상세 페이지
	const tagCounts = await getTagCounts();
	const tagPages = Object.keys(tagCounts).map((tag) => ({
		url: `${baseUrl}/tags/${slugify(tag)}`,
		lastModified: currentDate,
		changeFrequency: "weekly" as const,
		priority: 0.6
	}));

	// 주요 페이지
	const routes: MetadataRoute.Sitemap = [
		{
			url: `${baseUrl}`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 1.0
		},
		{
			url: `${baseUrl}/posts`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.7
		},
		{
			url: `${baseUrl}/series`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.7
		},
		{
			url: `${baseUrl}/tags`,
			lastModified: currentDate,
			changeFrequency: "daily",
			priority: 0.7
		},
		{
			url: `${baseUrl}/about`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.5
		}
	];

	return [...routes, ...blogs, ...seriesPages, ...tagPages];
}
