import type { PostSummary } from "./post";

export type Series = {
	name: string;
	slug: string;
	posts: PostSummary[];
};

/**
 * 시리즈 통계 (M4-06 PRD §7.3).
 *
 * - total: 시리즈 소속 포스트 수.
 * - firstPublished: 가장 오래된 편의 발행일 (ISO 8601). 빈 시리즈는 `null`.
 * - lastUpdated: 가장 최근 편의 발행일 (ISO 8601). 빈 시리즈는 `null`.
 *
 * `null` 사용 이유: ISO 8601 문자열과 빈 문자열이 같은 `string` 타입이면
 * 호출자가 빈 시리즈를 분기하지 않고 비교 연산에 넣을 위험이 있다.
 * 실용적으로 `getAllSeries`가 빈 시리즈를 produce하지 않지만 타입 계약을 명확히 둔다.
 */
export type SeriesStats = {
	total: number;
	firstPublished: string | null;
	lastUpdated: string | null;
};
