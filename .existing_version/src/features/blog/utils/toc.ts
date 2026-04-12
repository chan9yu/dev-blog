import { slugify } from "@/shared/utils";

export type TocItem = {
	id: string;
	title: string;
	level: number;
};

export function extractTocFromMarkdown(content: string): TocItem[] {
	// 코드 블럭 제거 (```로 감싸진 부분)
	const contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");

	const headingRegex = /^(#{1,3})\s+(.+)$/gm;
	const toc: TocItem[] = [];
	let match;

	while ((match = headingRegex.exec(contentWithoutCodeBlocks)) !== null) {
		const levelStr = match[1];
		const titleStr = match[2];

		if (!levelStr || !titleStr) continue;

		const level = levelStr.length;
		const title = titleStr.trim();
		const id = slugify(title);

		// 빈 ID는 스킵
		if (id) {
			toc.push({ id, title, level });
		}
	}

	return toc;
}
