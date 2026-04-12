import { getAllPosts, validateSeriesIndex } from "@/features/blog";
import type { SeriesBucket } from "@/features/series/types";
import { slugify } from "@/shared/utils";

/**
 * 모든 시리즈 목록 가져오기
 */
export async function getAllSeries(): Promise<SeriesBucket[]> {
	const posts = await getAllPosts();

	const seriesMap = new Map<string, SeriesBucket>();

	posts.forEach((post) => {
		if (post.series && post.seriesOrder !== undefined) {
			const seriesSlug = slugify(post.series);

			if (!seriesMap.has(seriesSlug)) {
				seriesMap.set(seriesSlug, {
					name: post.series,
					slug: seriesSlug,
					posts: []
				});
			}

			const series = seriesMap.get(seriesSlug)!;
			series.posts.push(post);
		}
	});

	// 각 시리즈의 포스트를 seriesOrder 순서로 정렬 및 검증
	const allSeries = Array.from(seriesMap.values());

	allSeries.forEach((series) => {
		series.posts.sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));

		// 빌드 타임 검증: 시리즈 seriesOrder 중복 및 연속성 검사
		validateSeriesIndex(series);
	});

	// 최근 날짜 순서로 정렬
	return allSeries.sort((a, b) => {
		const aLatest = a.posts[0]?.date || "";
		const bLatest = b.posts[0]?.date || "";
		return bLatest.localeCompare(aLatest);
	});
}

/**
 * 특정 시리즈의 상세 정보 가져오기
 */
export async function getSeriesDetail(slug: string): Promise<SeriesBucket | null> {
	const allSeries = await getAllSeries();
	return allSeries.find((series) => series.slug === slug) || null;
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
