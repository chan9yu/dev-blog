import type { PostSummary, TagCount } from "@/shared/types";

/**
 * PostSummary[] 에서 태그를 집계해 TagCount[] 를 반환한다 (M2-23).
 *
 * - count 내림차순, 동률 시 tag 알파벳 오름차순 정렬.
 * - private 포스트 제외는 호출자(getPublicPosts) 책임.
 * - M4에서 getPostsByTag, getTrendingTags 등으로 확장 예정.
 *
 * @param posts - getPublicPosts() 결과 (private 제외)
 */
export function getAllTags(posts: PostSummary[]): TagCount[] {
	const countMap = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.tags) {
			countMap.set(tag, (countMap.get(tag) ?? 0) + 1);
		}
	}

	return Array.from(countMap.entries())
		.map(([tag, count]) => ({ tag, slug: tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
