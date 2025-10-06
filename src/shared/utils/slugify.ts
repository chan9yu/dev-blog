export function slugify(str: string): string {
	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9가-힣\s-]/g, "")
		.replace(/\s+/g, "-");
}

/**
 * URL-safe slug 생성 (한글 제거, 영문/숫자만)
 * 시리즈 URL 등에 사용
 */
export function slugifyUrlSafe(str: string): string {
	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "") // 한글 제거
		.replace(/\s+/g, "-")
		.replace(/^-+|-+$/g, ""); // 앞뒤 하이픈 제거
}
