import type { Series } from "@/shared/types";

export function getSeriesStats(series: Series) {
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
