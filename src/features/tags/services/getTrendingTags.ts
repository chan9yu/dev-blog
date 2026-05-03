import type { PostSummary, TagCount } from "@/shared/types";

import { getTagCounts } from "./getTagCounts";

const DEFAULT_LIMIT = 10;

export function getTrendingTags(posts: PostSummary[], limit = DEFAULT_LIMIT): TagCount[] {
	return getTagCounts(posts).slice(0, limit);
}
