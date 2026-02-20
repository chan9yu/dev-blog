import { getAllPosts } from "@/features/blog";
import type { TagCount } from "@/features/tags/types";

/**
 * 모든 태그와 포스트 개수 가져오기
 */
export async function getTagCounts(): Promise<TagCount> {
	const posts = await getAllPosts();
	const tagCounts: TagCount = {};

	posts.forEach((post) => {
		post.tags.forEach((tag) => {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		});
	});

	return tagCounts;
}
