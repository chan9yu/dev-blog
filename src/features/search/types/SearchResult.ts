import type { FuseResultMatch } from "fuse.js";

import type { PostSummary } from "@/shared/types";

// `score`: Fuse.js 관례상 0(완전 일치)~1(불일치) — 낮을수록 관련도 높음.
export type SearchResult = {
	post: PostSummary;
	score: number;
	matches?: ReadonlyArray<FuseResultMatch>;
};
