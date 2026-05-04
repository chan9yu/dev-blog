import type { PostSummary, Series } from "@/shared/types";

export type SeriesAdjacency = {
	prev: PostSummary | null;
	next: PostSummary | null;
	order: number | null;
	total: number;
};

export function getAdjacentInSeries(series: Series, currentSlug: string) {
	const ordered = [...series.posts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
	const index = ordered.findIndex((post) => post.slug === currentSlug);

	if (index === -1) {
		return { prev: null, next: null, order: null, total: ordered.length };
	}

	return {
		prev: index > 0 ? (ordered[index - 1] ?? null) : null,
		next: index < ordered.length - 1 ? (ordered[index + 1] ?? null) : null,
		order: ordered[index]?.seriesOrder ?? null,
		total: ordered.length
	};
}
