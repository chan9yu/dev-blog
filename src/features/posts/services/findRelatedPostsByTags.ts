import type { PostSummary, RelatedPost } from "@/shared/types";

const DEFAULT_LIMIT = 3;

/**
 * 태그 겹침 점수 기반 관련 포스트 상위 N개 (M4-16, PRD §7.1).
 *
 * - `overlapScore`: target과 공유하는 태그 수 (정확 일치).
 * - target 본인은 결과에서 제외.
 * - overlap이 0인 포스트는 제외.
 * - 정렬: overlapScore desc → 입력 순서(date desc 가정) 보존.
 * - target 자체에 태그가 없으면 빈 배열 반환 (모든 후보의 overlap이 0).
 *
 * 순수 함수 — private 제외는 호출자(`getPublicPosts()`) 책임.
 */
export function findRelatedPostsByTags(
	posts: PostSummary[],
	target: PostSummary,
	limit = DEFAULT_LIMIT
): RelatedPost[] {
	if (target.tags.length === 0) return [];

	return posts
		.filter((post) => post.slug !== target.slug)
		.map((post) => ({
			...post,
			overlapScore: post.tags.filter((tag) => target.tags.includes(tag)).length
		}))
		.filter((post) => post.overlapScore > 0)
		.sort((a, b) => b.overlapScore - a.overlapScore)
		.slice(0, limit);
}
