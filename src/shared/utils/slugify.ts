export function slugify(str: string): string {
	return (
		str
			.toString()
			.trim()
			// 영문자, 숫자, 한글, 공백, 하이픈만 허용 (대소문자 유지)
			.replace(/[^a-zA-Z0-9가-힣\s-]/g, "")
			.replace(/\s+/g, "-")
	);
}

/**
 * URL-safe slug 생성 (한글 유지, 특수문자만 제거, 대소문자 유지)
 * 시리즈 URL 등에 사용
 *
 * 예시:
 * - "항해 플러스 프론트엔드 6기" → "항해-플러스-프론트엔드-6기"
 * - "WebRTC 박살내기!" → "WebRTC-박살내기"
 */
export function slugifyUrlSafe(str: string): string {
	return str
		.toString()
		.trim()
		.replace(/[^\w가-힣\s-]/g, "") // 영문, 숫자, 한글, 공백, 하이픈만 허용
		.replace(/\s+/g, "-") // 공백을 하이픈으로
		.replace(/-+/g, "-") // 연속된 하이픈을 하나로
		.replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
}
