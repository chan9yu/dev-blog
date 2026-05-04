import type { PostSummary } from "./post";

export type Series = {
	name: string;
	slug: string;
	posts: PostSummary[];
};

// 빈 시리즈에 대해 빈 문자열 대신 `null`을 반환하여 호출자가 비교 연산에 잘못 넣는 것을 차단.
export type SeriesStats = {
	total: number;
	firstPublished: string | null;
	lastUpdated: string | null;
};
