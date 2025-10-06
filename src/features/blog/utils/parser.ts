import matter from "gray-matter";

import type { Frontmatter } from "@/features/blog/schemas";
import { FrontmatterSchema } from "@/features/blog/schemas";

/**
 * MDX 파일 내용 파싱 및 Frontmatter 검증
 */
export function parseFrontmatter(fileContent: string) {
	const { data, content } = matter(fileContent);

	const result = FrontmatterSchema.safeParse(data);
	if (!result.success) {
		throw new Error(`Frontmatter 검증 실패:\n${JSON.stringify(result.error.issues, null, 2)}`);
	}

	return {
		metadata: result.data,
		content
	};
}

/**
 * Frontmatter만 추출 (내용 불필요한 경우)
 * @deprecated 현재 사용되지 않음. parseFrontmatter 사용 권장.
 */
export function extractFrontmatter(fileContent: string): Frontmatter {
	const { metadata } = parseFrontmatter(fileContent);
	return metadata;
}
