/**
 * slug 패턴 검증 유틸.
 *
 * 두 입력 소스 처리:
 * - URL segment (`[slug]`, `[tag]`): `normalizeSlug` — decode + 검증
 * - API body / unknown 값 (`api/views` POST): `validateSlug` — 타입 가드 + 검증
 *
 * 공통 규약 (`seo.md` slug):
 * - 영문 소문자 + 숫자 + 하이픈만 (한글·특수문자 거부)
 * - 1 ≤ length ≤ maxLength
 */

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SLUG_MAX_LENGTH = 120;
export const TAG_MAX_LENGTH = 60;

/**
 * URL 세그먼트를 decode 후 검증. 실패 시 null → 호출자가 `notFound()`로 404 처리.
 */
export function normalizeSlug(raw: string, maxLength = SLUG_MAX_LENGTH) {
	try {
		const decoded = decodeURIComponent(raw);
		if (decoded.length === 0 || decoded.length > maxLength) return null;
		if (!SLUG_PATTERN.test(decoded)) return null;
		return decoded;
	} catch {
		return null;
	}
}

/**
 * API 입력(JSON body 등)의 unknown 값을 검증. typeof 가드 + 패턴·길이.
 */
export function validateSlug(value: unknown, maxLength = SLUG_MAX_LENGTH) {
	if (typeof value !== "string") return null;
	if (value.length === 0 || value.length > maxLength) return null;
	if (!SLUG_PATTERN.test(value)) return null;
	return value;
}
