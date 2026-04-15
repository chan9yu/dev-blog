import { getPublicPosts } from "./getPublicPosts";

/**
 * date-desc 배열에서 인접 포스트를 찾는다.
 * - `prev`: 현재보다 과거(배열 뒤쪽) 포스트
 * - `next`: 현재보다 미래(배열 앞쪽) 포스트
 */
export function getAdjacentPosts(currentSlug: string) {
	const posts = getPublicPosts();
	const index = posts.findIndex((post) => post.slug === currentSlug);

	if (index === -1) {
		return {
			prev: null,
			next: null
		};
	}

	return {
		prev: index < posts.length - 1 ? (posts[index + 1] ?? null) : null,
		next: index > 0 ? (posts[index - 1] ?? null) : null
	};
}
