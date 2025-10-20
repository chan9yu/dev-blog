/**
 * URL-safe slug 생성 (한글 유지, 특수문자 제거, 대소문자 유지)
 *
 * 기능:
 * - 영문자, 숫자, 한글, 공백, 하이픈만 허용
 * - 공백을 하이픈(-)으로 변환
 * - 연속된 하이픈을 하나로 정리
 * - 앞뒤 하이픈 제거
 * - 대소문자 유지 (WebRTC → WebRTC)
 *
 * 사용처: 태그, 시리즈, TOC 앵커 등 모든 URL slug 생성
 *
 * 예시:
 * - "항해 플러스 프론트엔드 6기" → "항해-플러스-프론트엔드-6기"
 * - "WebRTC 박살내기!" → "WebRTC-박살내기"
 * - "Hello  World--Test" → "Hello-World-Test"
 */
export function slugify(str: string): string {
	return str
		.toString()
		.trim()
		.replace(/[^\w가-힣\s-]/g, "") // 영문, 숫자, 한글, 공백, 하이픈만 허용
		.replace(/\s+/g, "-") // 공백을 하이픈으로
		.replace(/-+/g, "-") // 연속된 하이픈을 하나로
		.replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
}
