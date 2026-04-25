import type { AdjacentPosts, PostSummary } from "@/shared/types";

/**
 * date desc로 정렬된 포스트 배열에서 인접 포스트를 찾는다 (M4-18, PRD §7.1).
 *
 * - `prev`: 현재보다 과거(배열 뒤쪽) 포스트
 * - `next`: 현재보다 미래(배열 앞쪽) 포스트
 * - 첫·마지막 포스트는 한쪽이 `null`
 * - slug 미일치 시 양쪽 모두 `null`
 *
 * 순수 함수 — 입력 정렬·필터링은 호출자 책임 (`getPublicPosts()`가 date desc + private 제외 보장).
 */
export function findAdjacentPosts(posts: PostSummary[], slug: string): AdjacentPosts {
	const index = posts.findIndex((post) => post.slug === slug);

	if (index === -1) {
		return { prev: null, next: null };
	}

	return {
		prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
		next: index > 0 ? (posts[index - 1] ?? null) : null
	};
}
