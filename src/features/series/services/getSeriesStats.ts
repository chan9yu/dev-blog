import type { Series, SeriesStats } from "@/shared/types";

/**
 * 시리즈 통계를 계산한다 (M4-07 PRD §7.3).
 *
 * - total: 시리즈 소속 포스트 수.
 * - firstPublished: 가장 오래된 편의 발행일 (ISO 8601) — 빈 시리즈는 `null`.
 * - lastUpdated: 가장 최근 편의 발행일 (ISO 8601) — 빈 시리즈는 `null`.
 *
 * `Series.posts`는 `getAllSeries` 단계에서 `seriesOrder asc`로 정렬되어 있으나,
 * 발행일 순서는 별개이므로 본 함수에서 `date` 기준으로 직접 비교한다.
 *
 * 빈 시리즈는 `getAllSeries`가 produce하지 않으므로 실용적으로 도달 불가.
 * 그래도 타입 계약을 명확히 두기 위해 `null`을 반환한다.
 */
export function getSeriesStats(series: Series): SeriesStats {
	const dates = series.posts.map((post) => post.date);

	if (dates.length === 0) {
		return { total: 0, firstPublished: null, lastUpdated: null };
	}

	const sorted = [...dates].sort();

	return {
		total: dates.length,
		firstPublished: sorted[0] ?? null,
		lastUpdated: sorted[sorted.length - 1] ?? null
	};
}
