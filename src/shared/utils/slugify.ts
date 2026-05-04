/**
 * 텍스트를 URL/ID 안전 slug로 변환한다.
 *
 * **rehype-slug(github-slugger)와 동일한 결과를 보장하는 연산 순서**:
 * 1. 소문자 변환
 * 2. 각 공백을 개별 하이픈으로 변환 (`\s` 하나씩, `\s+` collapse 금지)
 * 3. 허용 문자 외 제거 (이미 변환된 하이픈은 유지)
 * 4. 앞뒤 하이픈 제거
 *
 * 예:
 * - "Step 1: A - B"  → "step-1-a---b"   (` - ` → 공백→`-`, `-`, 공백→`-`)
 * - "명시적 > 암묵적" → "명시적--암묵적"  (` > ` → 공백→`-`, `>` 제거, 공백→`-`)
 */
export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/\s/g, "-")
		.replace(/[^a-z0-9가-힣-]/g, "")
		.replace(/^-+|-+$/g, "");
}
