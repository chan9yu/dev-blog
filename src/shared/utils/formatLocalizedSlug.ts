/**
 * 한글이 포함된 slug의 hyphen을 공백으로 역변환해 표시명으로 사용.
 * URL은 메신저 호환을 위해 hyphen 정규화하고, 화면 표시는 자연스러운 공백 단어 분리를 복원.
 *
 * 영문 전용 slug(`react-19` 등)는 hyphen이 의도된 kebab-case이므로 변환 대상이 아님.
 */
const HANGUL_PATTERN = /[ㄱ-ㆎ가-힣]/;

export function formatLocalizedSlug(slug: string) {
	if (!HANGUL_PATTERN.test(slug)) return slug;
	return slug.replaceAll("-", " ");
}
