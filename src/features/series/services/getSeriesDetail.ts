import type { PostSummary } from "@/shared/types";

import { getAllSeries } from "./getAllSeries";

export function getSeriesDetail(posts: PostSummary[], slug: string) {
	return getAllSeries(posts).find((series) => series.slug === slug) ?? null;
}
