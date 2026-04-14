import dayjs from "dayjs";

/**
 * ISO 8601 문자열을 YYYY.MM.DD 포맷으로 변환.
 * 포스트 카드·사이드바 목록 등 짧은 날짜 표기에 사용.
 *
 * dayjs 플러그인(relativeTime·locale/ko)은 필요 시점(M1-28 포스트 상세 `fromNow` 등)에 추가한다.
 */
export function formatDate(iso: string): string {
	return dayjs(iso).format("YYYY.MM.DD");
}
