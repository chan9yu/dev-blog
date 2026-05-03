import type { PostSummary } from "@/shared/types";

export function getPostsByTag(posts: PostSummary[], tag: string): PostSummary[] {
	return posts.filter((post) => post.tags.includes(tag));
}
