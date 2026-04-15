import { getPublicPosts } from "./getPublicPosts";

const DEFAULT_LIMIT = 3;

/**
 * 현재 포스트의 태그와 겹치는 태그 수를 기준으로 연관 공개 포스트 상위 N개를 반환한다.
 * 겹침이 0인 포스트는 제외. 동률은 date desc(= getPublicPosts 기본 정렬) 순서를 유지한다.
 */
export function getRelatedPosts(currentSlug: string, tags: string[], limit = DEFAULT_LIMIT) {
	return getPublicPosts()
		.filter((post) => post.slug !== currentSlug)
		.map((post) => ({ ...post, overlapScore: post.tags.filter((tag) => tags.includes(tag)).length }))
		.filter((post) => post.overlapScore > 0)
		.sort((a, b) => b.overlapScore - a.overlapScore)
		.slice(0, limit);
}
