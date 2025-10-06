import { getAllPosts } from "./api";

export async function getAllTags(): Promise<string[]> {
	const posts = await getAllPosts();
	const tagSet = new Set<string>();

	posts.forEach((post) => {
		post.tags.forEach((tag) => tagSet.add(tag));
	});

	return Array.from(tagSet).sort();
}

export async function getTagCounts(): Promise<Record<string, number>> {
	const posts = await getAllPosts();
	const tagCounts: Record<string, number> = {};

	posts.forEach((post) => {
		post.tags.forEach((tag) => {
			tagCounts[tag] = (tagCounts[tag] || 0) + 1;
		});
	});

	return tagCounts;
}
