import type { PostSummary } from "./post";
import type { Series } from "./series";
import type { TagCount } from "./tag";

export type TrendingSnapshot = {
	popularPosts: PostSummary[];
	trendingSeries: Series[];
	trendingTags: TagCount[];
	generatedAt: string;
	fallback?: boolean;
};
