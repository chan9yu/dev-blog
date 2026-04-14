import type { TrendingSnapshot } from "@/shared/types";

import { postsFixture } from "./posts";
import { seriesFixture } from "./series";
import { tagsFixture } from "./tags";

/**
 * 더미 TrendingSnapshot — `postsFixture`·`seriesFixture`·`tagsFixture`에서 파생.
 *
 * 정렬 기준 (M1 단계, UI 스켈레톤 목적):
 * - `popularPosts`: public 포스트를 `date desc`로 상위 5건. 실제 ADR-007은 누적 조회수 desc지만 fixture는 KV 조회수가 없어 **최근 발행순 fallback**과 동일한 출력으로 대체.
 * - `trendingSeries`: 소속 public 포스트 수 desc, 동률 시 최근 편 발행일 desc. `seriesFixture`는 이미 이 순서로 정렬된 상태이므로 그대로 slice.
 * - `trendingTags`: public 기준 count desc, 동률 시 tag asc. `tagsFixture`도 같은 정렬이라 상위 10개 slice.
 *
 * `generatedAt`은 재현성을 위해 고정. M4-13에서 실제 스냅샷 생성기가 이 값을 대체한다.
 * `fallback`은 생략(undefined) → 정상 스냅샷 의미.
 */
export const trendingFixture: TrendingSnapshot = {
	popularPosts: postsFixture.filter((post) => !post.private).slice(0, 5),
	trendingSeries: seriesFixture.slice(0, 3),
	trendingTags: tagsFixture.slice(0, 10),
	generatedAt: "2026-04-14T00:00:00.000Z"
};
