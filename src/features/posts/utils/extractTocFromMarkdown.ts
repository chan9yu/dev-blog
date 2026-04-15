import type { TocItem } from "@/shared/types";
import { slugify } from "@/shared/utils/slugify";

/**
 * 마크다운 본문에서 h2/h3 heading을 추출하여 TocItem[] 반환 (M2-09).
 *
 * - h1(# )과 h4 이하는 제외
 * - 펜스 코드 블록(``` ... ```) 내 heading은 무시
 * - TocItem.id = slugify(heading text)
 * - 순서는 문서 상 등장 순서를 보존
 */
export function extractTocFromMarkdown(content: string): TocItem[] {
	// 코드 블록 내 heading을 무시하기 위해 먼저 제거
	const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

	const toc: TocItem[] = [];
	const headingPattern = /^(#{2,3})\s+(.+)$/gm;
	let match: RegExpExecArray | null;

	while ((match = headingPattern.exec(withoutCodeBlocks)) !== null) {
		const hashes = match[1];
		const raw = match[2];
		if (!hashes || !raw) continue;

		const text = raw.trim();
		const level = hashes.length as 2 | 3;
		toc.push({ id: slugify(text), level, text });
	}

	return toc;
}
