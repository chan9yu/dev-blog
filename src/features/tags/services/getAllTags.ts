import type { PostSummary } from "@/shared/types";

/**
 * 포스트 배열에서 unique 태그 slug 목록을 반환한다 (M4-01).
 *
 * - 정렬: 알파벳 오름차순 (안정적 라우팅 키 정렬).
 * - 중복 제거: 같은 태그가 여러 포스트에 있어도 1번만 등장.
 * - 주 용도: `generateStaticParams` (RT-/tags/[tag]).
 * - private 제외는 호출자(`getPublicPosts`) 책임 (Law 3).
 *
 * 카운트 포함 형태가 필요하면 `getTagCounts`를 사용한다.
 */
export function getAllTags(posts: PostSummary[]): string[] {
	const tagSet = new Set<string>();
	for (const post of posts) {
		for (const tag of post.tags) {
			tagSet.add(tag);
		}
	}
	return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}
