import type { FuseResultMatch } from "fuse.js";

import type { PostSummary } from "@/shared/types";

/**
 * MOD-search 검색 결과 항목.
 *
 * - `score`는 Fuse.js 관례상 0(완전 일치)~1(불일치). 낮을수록 관련도 높음.
 * - `matches`는 하이라이트용 매칭 구간 정보. 필드(key)와 문자열 인덱스 범위를 포함.
 */
export type SearchResult = {
	post: PostSummary;
	score: number;
	matches?: ReadonlyArray<FuseResultMatch>;
};
