import type { PostSummary } from "@/features/blog/types";

const MAX_RELATED_POSTS = 3;

/**
 * 포스트를 날짜 기준 최신순으로 정렬합니다.
 */
export const sortPostsByDateDescending = (posts: PostSummary[]) =>
	[...posts].toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * 태그 기반으로 관련 포스트를 찾습니다.
 * 매칭되는 태그가 많은 순으로 정렬하여 반환합니다.
 */
export const findRelatedPostsByTags = (
	allPosts: PostSummary[],
	currentSlug: string,
	currentTags: string[] | undefined,
	limit = MAX_RELATED_POSTS
) =>
	allPosts
		.filter((p) => p.slug !== currentSlug)
		.map((p) => {
			const matchingTags = p.tags?.filter((tag) => currentTags?.includes(tag)) || [];
			return { post: p, matchCount: matchingTags.length };
		})
		.filter((item) => item.matchCount > 0)
		.toSorted((a, b) => b.matchCount - a.matchCount)
		.slice(0, limit)
		.map((item) => item.post);

/**
 * 정렬된 포스트 목록에서 현재 포스트의 이전/다음 포스트를 찾습니다.
 * (이전글 = 더 오래된 글, 다음글 = 더 최신 글)
 */
export const findAdjacentPosts = (sortedPosts: PostSummary[], currentSlug: string) => {
	const currentIndex = sortedPosts.findIndex((p) => p.slug === currentSlug);
	return {
		prevPost: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null,
		nextPost: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
	};
};
