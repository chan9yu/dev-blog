import type { TocItem } from "@/shared/types";
import { slugify } from "@/shared/utils/slugify";

/**
 * 마크다운 본문에서 h1·h2·h3 heading을 추출하여 TocItem[] 반환 (M2-09).
 *
 * - h4 이하는 제외 (목차가 지나치게 깊어지는 것 방지)
 * - CustomMDX.tsx에서 MDX heading을 +1 시프트 렌더링하므로
 *   # → <h2>, ## → <h3>, ### → <h4>로 표시되지만, TOC id는 rehype-slug가
 *   원본 레벨 기준으로 부여한 id와 일치해야 함 — slugify() 결과로 동기화.
 * - 펜스 코드 블록(``` ... ```) 내 heading은 무시
 * - TocItem.id = slugify(heading text), rehype-slug와 동일하게 중복 id에 -1, -2 suffix 부여
 * - TocItem.text는 인라인 마크다운(**, *, `) 제거 후 순수 텍스트
 * - 순서는 문서 상 등장 순서를 보존
 */
export function extractTocFromMarkdown(content: string): TocItem[] {
	// 코드 블록 내 heading을 무시하기 위해 먼저 제거
	const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

	const toc: TocItem[] = [];
	const seenIds = new Map<string, number>();
	const headingPattern = /^(#{1,3})\s+(.+)$/gm;
	let match: RegExpExecArray | null;

	while ((match = headingPattern.exec(withoutCodeBlocks)) !== null) {
		const hashes = match[1];
		const raw = match[2];
		if (!hashes || !raw) continue;

		// 인라인 마크다운 제거: **bold**, *italic*, `code`
		const text = raw
			.trim()
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			.replace(/\*([^*]+)\*/g, "$1")
			.replace(/`([^`]+)`/g, "$1");
		const level = hashes.length as 1 | 2 | 3;
		const baseId = slugify(text);

		const count = seenIds.get(baseId) ?? 0;
		const id = count === 0 ? baseId : `${baseId}-${count}`;
		seenIds.set(baseId, count + 1);

		toc.push({ id, level, text });
	}

	return toc;
}
