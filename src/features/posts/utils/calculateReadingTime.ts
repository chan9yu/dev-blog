/** 한국어 평균 읽기 속도: 500자/분 (ADR-008) */
const CHARS_PER_MINUTE = 500;

/**
 * 마크다운 본문에서 읽기 시간(분)을 계산한다.
 *
 * 제거 대상 (읽기 시간에서 제외):
 * - 펜스 코드 블록 (``` ... ```)
 * - 블록 수식 ($$ ... $$)
 * - 인라인 수식 ($ ... $)
 * - 이미지 마크다운 (![alt](src))
 *
 * 결과: ceil(charCount / 500), 최소 1분
 */
export function calculateReadingTime(content: string): number {
	const stripped = content
		.replace(/```[\s\S]*?```/g, "") // 펜스 코드 블록 제거
		.replace(/\$\$[\s\S]*?\$\$/g, "") // 블록 수식 제거
		.replace(/\$[^$\n]+\$/g, "") // 인라인 수식 제거
		.replace(/!\[.*?\]\(.*?\)/g, "") // 이미지 제거
		.trim();

	const charCount = stripped.length;

	return Math.max(1, Math.ceil(charCount / CHARS_PER_MINUTE));
}
