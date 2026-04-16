import { readFileSync } from "node:fs";
import { join } from "node:path";

import matter from "gray-matter";

import type { PostDetail } from "@/shared/types";

import { calculateReadingTime } from "../utils/calculateReadingTime";
import { extractTocFromMarkdown } from "../utils/extractTocFromMarkdown";
import { parseFrontmatter } from "../utils/parseFrontmatter";
import { POSTS_DIR } from "./paths";

/**
 * CommonMark flanking delimiter 규칙을 우회하기 위해 `**...**` → `<strong>...</strong>` 변환.
 *
 * 닫는 `**` 앞에 `)` 같은 구두점이 오고 뒤에 한글(비공백·비구두점)이 붙으면
 * CommonMark §6.4(Emphasis) 규칙상 닫힘 조건 불충족으로 리터럴 `**`이 출력된다.
 * MDX 파서에 도달하기 전에 HTML 태그로 교체해 파서를 우회한다.
 *
 * 코드 펜스(``` ``` ```)와 인라인 코드(`` ` ``)는 마스킹 후 복원해 보존한다.
 * 현재 콘텐츠는 작성자 통제 하에 있으므로 raw HTML 신뢰를 전제로 한다.
 */
function preprocessMdxContent(content: string): string {
	const fences: string[] = [];
	const inlines: string[] = [];

	// 1. 코드 펜스 마스킹 (내부 ** 보존)
	let masked = content.replace(/```[\s\S]*?```/g, (m) => {
		fences.push(m);
		return `\u0000FENCE${fences.length - 1}\u0000`;
	});

	// 2. 인라인 코드 마스킹
	masked = masked.replace(/`[^`\n]+`/g, (m) => {
		inlines.push(m);
		return `\u0000INLINE${inlines.length - 1}\u0000`;
	});

	// 3. 단일 줄 내에서만 ** → <strong> 치환 (\n 불허로 단락 넘김 방지)
	masked = masked.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");

	// 4. 복원
	masked = masked.replace(/\u0000INLINE(\d+)\u0000/g, (_, i) => inlines[Number(i)] ?? "");
	masked = masked.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)] ?? "");

	return masked;
}

/**
 * slug에 해당하는 PostDetail을 반환한다 (M2-15).
 *
 * - 파일이 없거나 frontmatter 검증 실패 시 null 반환.
 * - private 포스트도 반환한다. private 필터링은 호출자 책임.
 * - contentMdx: frontmatter를 제외한 MDX 본문 원문(전처리 적용).
 * - toc: 본문의 h1·h2·h3 heading 순서 보존 추출 (h4 이하 제외).
 */
export function getPostDetail(slug: string): PostDetail | null {
	const filePath = join(POSTS_DIR, slug, "index.mdx");

	try {
		const raw = readFileSync(filePath, "utf-8");
		const frontmatter = parseFrontmatter(raw, slug);
		const { content } = matter(raw);

		// toc는 원본 content로 추출 — processedContent엔 <strong> 태그가 삽입되어
		// 헤딩 텍스트와 rehype-slug가 생성하는 id가 불일치할 수 있음
		const toc = extractTocFromMarkdown(content);
		const processedContent = preprocessMdxContent(content);
		const readingTimeMinutes = calculateReadingTime(processedContent);

		return {
			...frontmatter,
			readingTimeMinutes,
			contentMdx: processedContent,
			toc
		};
	} catch {
		return null;
	}
}
