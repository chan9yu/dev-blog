import { getAllPosts } from "@/features/blog";
import { slugifyUrlSafe } from "@/shared/utils";

import type { SeriesBucket } from "../types";

/**
 * 모든 시리즈 목록 가져오기
 */
export async function getAllSeries(): Promise<SeriesBucket[]> {
	const posts = await getAllPosts();

	const seriesMap = new Map<string, SeriesBucket>();

	posts.forEach((post) => {
		if (post.series && post.index !== undefined) {
			const seriesSlug = slugifyUrlSafe(post.series);

			if (!seriesMap.has(seriesSlug)) {
				seriesMap.set(seriesSlug, {
					name: post.series,
					url_slug: seriesSlug,
					updated_at: post.updated_at,
					posts: []
				});
			}

			const series = seriesMap.get(seriesSlug)!;
			series.posts.push(post);

			// 가장 최근 업데이트된 날짜로 갱신
			if (post.updated_at > series.updated_at) {
				series.updated_at = post.updated_at;
			}
		}
	});

	// 각 시리즈의 포스트를 index 순서로 정렬
	seriesMap.forEach((series) => {
		series.posts.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
	});

	// 최근 업데이트된 순서로 정렬
	return Array.from(seriesMap.values()).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

/**
 * 특정 시리즈의 상세 정보 가져오기
 */
export async function getSeriesDetail(slug: string): Promise<SeriesBucket | null> {
	const allSeries = await getAllSeries();
	return allSeries.find((series) => series.url_slug === slug) || null;
}

/**
 * 시리즈 통계 정보 가져오기
 */
export async function getSeriesStats() {
	const allSeries = await getAllSeries();

	return {
		totalSeries: allSeries.length,
		totalPostsInSeries: allSeries.reduce((sum, series) => sum + series.posts.length, 0)
	};
}
