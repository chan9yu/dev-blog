import type { PostSummary, Series } from "@/shared/types";

import { getAllSeries } from "./getAllSeries";
import { getSeriesStats } from "./getSeriesStats";

const DEFAULT_LIMIT = 3;

/**
 * 빌드 타임 시리즈 트렌딩 스냅샷 (M4-09, ADR-007).
 *
 * 정렬 규칙 (PRD §7.3):
 * 1. 소속 public 포스트 수 내림차순
 * 2. 동률 시 최근 편 발행일 내림차순 (`getSeriesStats(series).lastUpdated`)
 *
 * - private 기여분 제외는 호출자(`getPublicPosts`) 책임.
 * - 정렬 후 상위 N개 (기본 3) 반환.
 * - 사전 계산된 `lastUpdated`로 sort 비교 비용을 O(N log N × M) → O(N M + N log N)로 감축.
 *
 * @param posts - `getPublicPosts()` 결과 (private 제외)
 * @param limit - 반환 개수 (default 3)
 */
export function getTrendingSeries(posts: PostSummary[], limit = DEFAULT_LIMIT): Series[] {
	return getAllSeries(posts)
		.map((series) => ({ series, lastUpdated: getSeriesStats(series).lastUpdated ?? "" }))
		.sort((a, b) => {
			const countDiff = b.series.posts.length - a.series.posts.length;
			if (countDiff !== 0) return countDiff;
			return b.lastUpdated.localeCompare(a.lastUpdated);
		})
		.slice(0, limit)
		.map(({ series }) => series);
}
