import type { PostSummary, TagCount } from "@/shared/types";

export function getTagCounts(posts: PostSummary[]): TagCount[] {
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
