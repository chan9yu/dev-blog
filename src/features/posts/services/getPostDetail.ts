import { readFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import type { PostDetail } from "@/shared/types";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { extractTocFromMarkdown } from "../utils/extractTocFromMarkdown";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { POSTS_DIR } from "./paths";

/**
 * slug에 해당하는 PostDetail을 반환한다 (M2-15).
 *
 * - 파일이 없거나 frontmatter 검증 실패 시 null 반환.
 * - private 포스트도 반환한다. private 필터링은 호출자 책임.
 * - contentMdx: frontmatter를 제외한 MDX 본문 원문.
 * - toc: 본문의 h2·h3 heading 순서 보존 추출.
 */
export function getPostDetail(slug: string): PostDetail | null {
	const filePath = join(POSTS_DIR, slug, "index.mdx");

	try {
		const raw = readFileSync(filePath, "utf-8");
		const frontmatter = parseFrontmatter(raw, slug);
		const { content } = matter(raw);
		const readingTimeMinutes = calculateReadingTime(content);
		const toc = extractTocFromMarkdown(content);

		return {
			...frontmatter,
			readingTimeMinutes,
			contentMdx: content,
			toc
		};
	} catch {
		return null;
	}
}
