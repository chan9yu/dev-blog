import type { PostSummary, Series } from "@/shared/types";

import { getAllSeries } from "./getAllSeries";

export function getSeriesDetail(posts: PostSummary[], slug: string): Series | null {
	return getAllSeries(posts).find((series) => series.slug === slug) ?? null;
}
