const WORDS_PER_MINUTE = 200;

/**
 * 텍스트 길이를 기반으로 예상 읽기 시간을 계산합니다.
 * @param content - 읽기 시간을 계산할 텍스트
 * @returns 예상 읽기 시간 (분)
 */
export function calculateReadingTime(content: string): number {
	const wordCount = content.trim().split(/\s+/).length;
	return Math.ceil(wordCount / WORDS_PER_MINUTE);
}
