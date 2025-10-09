import { getAllPosts } from "./api";

/**
 * 모든 태그 목록 가져오기 (게시글 수와 함께)
 */
export async function getAllTags(): Promise<Array<{ tag: string; count: number }>> {
	const posts = await getAllPosts();

	const tagMap = new Map<string, number>();

	posts.forEach((post) => {
		post.tags.forEach((tag) => {
			tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
		});
	});

	return Array.from(tagMap.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count);
}

/**
 * 특정 태그가 포함된 게시글 목록 가져오기
 */
export async function getPostsByTag(tag: string) {
	const posts = await getAllPosts();
	return posts.filter((post) => post.tags.includes(tag));
}
