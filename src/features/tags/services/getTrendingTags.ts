import type { PostSummary } from "@/shared/types";

import { getTagCounts } from "./getTagCounts";

const DEFAULT_LIMIT = 10;

export function getTrendingTags(posts: PostSummary[], limit = DEFAULT_LIMIT) {
	return getTagCounts(posts).slice(0, limit);
}
