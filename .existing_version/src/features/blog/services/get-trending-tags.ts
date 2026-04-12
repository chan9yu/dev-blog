import type { PostSummary } from "@/features/blog/types";

import { getAllPosts } from "./api";

type TagCount = {
	name: string;
	count: number;
};

/**
 * 가장 많이 사용된 태그 목록을 반환합니다.
 * @param limit - 반환할 태그 개수 (기본값: 10)
 * @returns 사용 횟수가 많은 순으로 정렬된 태그 목록
 */
export async function getTrendingTags(limit: number = 10): Promise<TagCount[]> {
	const posts = await getAllPosts();

	// 태그별 카운트 집계
	const tagCountMap = new Map<string, number>();

	posts.forEach((post: PostSummary) => {
		if (post.tags && post.tags.length > 0) {
			post.tags.forEach((tag: string) => {
				tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1);
			});
		}
	});

	// Map을 배열로 변환하고 카운트 기준으로 정렬
	const sortedTags = Array.from(tagCountMap.entries())
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, limit);

	return sortedTags;
}
