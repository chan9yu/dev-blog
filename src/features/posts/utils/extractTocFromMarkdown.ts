import type { TocItem } from "@/shared/types";
import { slugify } from "@/shared/utils/slugify";

// 중복 id에 `-1`, `-2` suffix 부여는 rehype-slug 동작과 일치 — TOC 링크가 헤딩 id와 매칭되려면 동일 규칙 필수.
export function extractTocFromMarkdown(content: string): TocItem[] {
	const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

	const toc: TocItem[] = [];
	const seenIds = new Map<string, number>();
	const headingPattern = /^(#{1,3})\s+(.+)$/gm;
	let match: RegExpExecArray | null;

	while ((match = headingPattern.exec(withoutCodeBlocks)) !== null) {
		const hashes = match[1];
		const raw = match[2];
		if (!hashes || !raw) continue;

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
