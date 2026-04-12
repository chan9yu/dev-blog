import type { SeriesBucket } from "@/features/series/types";

import { getAllSeries } from "./api";

type SeriesCount = {
	name: string;
	slug: string;
	count: number;
};

/**
 * 포스트 개수가 많은 인기 시리즈를 반환합니다.
 * @param limit - 반환할 시리즈 개수 (기본값: 5)
 * @returns 포스트 개수가 많은 순으로 정렬된 시리즈 목록
 */
export async function getTrendingSeries(limit: number = 5): Promise<SeriesCount[]> {
	const allSeries = await getAllSeries();

	// 포스트 개수 기준으로 정렬
	const trendingSeries = allSeries
		.map((series: SeriesBucket) => ({
			name: series.name,
			slug: series.slug,
			count: series.posts.length
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, limit);

	return trendingSeries;
}
