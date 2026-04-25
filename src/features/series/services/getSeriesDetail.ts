import type { PostSummary, Series } from "@/shared/types";

import { getAllSeries } from "./getAllSeries";

/**
 * 특정 시리즈의 상세 정보를 조회한다 (M4-07).
 *
 * - `getAllSeries`로 전체를 그룹화한 뒤 slug로 매칭.
 * - 일치하는 시리즈가 없으면 `null` 반환 (호출자가 404 처리).
 * - private 제외는 호출자(`getPublicPosts`) 책임.
 *
 * @param posts - `getPublicPosts()` 결과 (private 제외)
 * @param slug - 시리즈 slug
 */
export function getSeriesDetail(posts: PostSummary[], slug: string): Series | null {
	return getAllSeries(posts).find((series) => series.slug === slug) ?? null;
}
