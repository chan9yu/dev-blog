import matter from "gray-matter";

import { FrontmatterSchema } from "@/features/blog/schemas";

/**
 * MDX 파일 내용 파싱 및 Frontmatter 검증
 */
export function parseFrontmatter(fileContent: string) {
	// 잘못된 frontmatter 구분자(--) 자동 수정
	// gray-matter는 --- (하이픈 3개)만 인식하므로 -- (하이픈 2개)를 자동 변환
	let normalizedContent = fileContent;

	// 파일 시작 부분의 -- 를 --- 로 변환
	if (normalizedContent.startsWith("--\n") || normalizedContent.startsWith("--\r\n")) {
		normalizedContent = normalizedContent.replace(/^--/, "---");
	}

	// 중간과 끝 부분의 독립된 -- 라인을 --- 로 변환
	normalizedContent = normalizedContent.replace(/\n--\n/g, "\n---\n");
	normalizedContent = normalizedContent.replace(/\n--\r\n/g, "\n---\r\n");

	const { data, content } = matter(normalizedContent);

	// MDX/Markdown 줄바꿈 처리
	let fixedContent = content;

	// 모든 단일 줄바꿈 끝에 두 스페이스 추가 (마크다운 hard line break)
	// 단, 이미 빈 줄(연속된 줄바꿈)이거나 마크다운 특수 문자로 시작하는 줄은 제외
	fixedContent = fixedContent.replace(/([^\n])\n(?=[^\n#\-*>`|])/g, "$1  \n");

	// 인라인 볼드 마크다운을 HTML로 변환
	// next-mdx-remote가 특정 컨텍스트에서 **텍스트**를 파싱하지 못하는 버그 우회
	fixedContent = fixedContent.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");

	const result = FrontmatterSchema.safeParse(data);
	if (!result.success) {
		throw new Error(`Frontmatter 검증 실패:\n${JSON.stringify(result.error.issues, null, 2)}`);
	}

	return {
		metadata: result.data,
		content: fixedContent
	};
}
