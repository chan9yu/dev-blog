import type { PostSummary, TagCount } from "@/shared/types";

import { postsFixture } from "./posts";

/**
 * `postsFixture` 중 `private: false` 포스트의 태그 토큰을 집계한다.
 *
 * 정렬: count desc, 동률 시 tag asc.
 * ADR-007: private 포스트(`internal-devlog-sketch`)의 `meta` 태그는 집계에서 제외.
 *
 * M1 단계에서는 postsFixture를 SSOT로 하는 **derive 방식**으로 silent drift를 방지한다.
 * M2에서 실제 `getTagCounts()` 서비스 함수로 교체될 때 이 함수는 제거된다.
 */
const aggregateTagCounts = (posts: PostSummary[]): TagCount[] => {
	const counts = new Map<string, number>();
	for (const post of posts) {
		if (post.private) continue;
		for (const tag of post.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([tag, count]) => ({ tag, slug: tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

/**
 * 더미 TagCount 배열 — public 12건 집계 결과.
 *
 * 예상 결과 (2026-04 현재 postsFixture 기준):
 * - count 5: react
 * - count 3: nextjs · react-19 · typescript
 * - count 2: architecture · performance · type-system
 * - count 1: a11y · cache · css · forms · playwright · rendering · security · server-actions · suspense · tailwind · testing · type-safety · ux
 * - 총 고유 태그 20종 / 태그 토큰 총합 31건
 */
export const tagsFixture: TagCount[] = aggregateTagCounts(postsFixture);
