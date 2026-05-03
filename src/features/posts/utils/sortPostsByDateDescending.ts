import type { PostSummary } from "@/shared/types";

export function sortPostsByDateDescending(posts: PostSummary[]): PostSummary[] {
	return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
