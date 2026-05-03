import type { AdjacentPosts, PostSummary } from "@/shared/types";

// 입력은 date desc 가정 — `prev`는 배열 뒤쪽(과거), `next`는 앞쪽(미래).
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
