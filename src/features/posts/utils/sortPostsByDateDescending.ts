import type { PostSummary } from "@/shared/types";

/**
 * PostSummary 배열을 날짜 내림차순으로 정렬한다 (M2-17).
 * 원본 배열을 변경하지 않는 순수 함수.
 */
export function sortPostsByDateDescending(posts: PostSummary[]): PostSummary[] {
	return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
