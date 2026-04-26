import type { MetadataRoute } from "next";

import { getPublicPosts } from "@/features/posts";
import { getAllSeries } from "@/features/series";
import { getAllTags } from "@/features/tags";
import { getSiteUrl } from "@/shared/config/site";

import { buildSitemapEntries } from "./sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
	const publicPosts = getPublicPosts();
	const tags = getAllTags(publicPosts);
	const series = getAllSeries(publicPosts);

	return buildSitemapEntries({
		siteUrl: getSiteUrl(),
		publicPosts,
		tags,
		series
	});
}
