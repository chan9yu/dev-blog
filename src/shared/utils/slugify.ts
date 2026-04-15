/**
 * 텍스트를 URL/ID 안전 slug로 변환한다.
 *
 * 규칙:
 * - 영문 대문자 → 소문자
 * - 한글·영문 소문자·숫자·하이픈만 허용 (나머지 특수문자 제거)
 * - 공백 → 하이픈
 * - 연속 하이픈 → 단일 하이픈
 * - 앞뒤 하이픈 제거
 *
 * 주로 MDX heading에서 TocItem.id를 생성할 때 사용.
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9가-힣\s-]/g, "") // 허용 문자 외 제거
		.trim()
		.replace(/\s+/g, "-") // 공백 → 하이픈
		.replace(/-+/g, "-") // 연속 하이픈 단일화
		.replace(/^-|-$/g, ""); // 앞뒤 하이픈 제거
}
