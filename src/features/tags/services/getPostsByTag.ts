import type { PostSummary } from "@/shared/types";

/**
 * 특정 태그를 포함한 포스트만 필터링한다 (M4-02).
 *
 * - 입력 정렬을 그대로 보존한다 (Array.prototype.filter 동작).
 * - 호출자가 `getPublicPosts()` 결과를 넘기면 자연스럽게 date desc 유지.
 * - private 제외는 호출자 책임.
 *
 * @param posts - `getPublicPosts()` 결과 (private 제외, date desc)
 * @param tag - 매칭할 태그명
 */
export function getPostsByTag(posts: PostSummary[], tag: string): PostSummary[] {
	return posts.filter((post) => post.tags.includes(tag));
}
