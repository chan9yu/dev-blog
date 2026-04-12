import type { PostSummary } from "@/features/blog";

/**
 * 시리즈 그룹 정보
 */
export interface SeriesBucket {
	name: string;
	slug: string;
	posts: PostSummary[];
}
